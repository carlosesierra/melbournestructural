import { NextRequest, NextResponse } from 'next/server';
import {
  QUOTE_ATTACHMENT_MAX_BYTES,
  validateQuoteAttachment,
} from '@/lib/get-a-quote';
import { sendQuoteEmail } from '@/lib/mailer';

export const runtime = 'nodejs';
export const preferredRegion = 'syd1';

const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const EMAIL_CONFIGURATION_ERROR =
  'Server email settings are not configured. Set the SMTP and form mailbox env vars in Vercel before sending mail.';
const EMAIL_DELIVERY_ERROR =
  'Something went wrong sending your message. Please try again or email us directly.';
const SMTP_RELAY_DENIED_ERROR =
  'Google Workspace SMTP relay denied the sending server. Allowlist the sending IP in Workspace SMTP relay settings and ensure SMTP_FROM and SMTP_NAME use your Workspace domain.';
const GMAIL_SMTP_AUTH_ERROR =
  'Google SMTP rejected the mailbox login. Set SMTP_HOST to smtp.gmail.com and provide SMTP_USER plus a valid Google app password in SMTP_PASS.';

type MailSendError = Error & {
  code?: string;
  command?: string;
  responseCode?: number;
  syscall?: string;
  address?: string;
  port?: number;
};

type UpstashPipelineResult = {
  result?: number | string | null;
  error?: string;
};

type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

type RecaptchaAssessmentResponse = {
  riskAnalysis?: {
    score?: number;
  };
  tokenProperties?: {
    action?: string;
    hostname?: string;
    invalidReason?: string;
    valid?: boolean;
  };
};

const RATE_LIMIT_WINDOW_SECONDS = parsePositiveInteger(
  process.env.RATE_LIMIT_WINDOW_SECONDS,
  10 * 60
);
const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_SECONDS * 1000;
const RATE_LIMIT_MAX_REQUESTS = parsePositiveInteger(
  process.env.RATE_LIMIT_MAX_REQUESTS,
  5
);
const RATE_LIMIT_KEY_PREFIX = trimString(process.env.RATE_LIMIT_KEY_PREFIX) || 'quote';
const RATE_LIMIT_REDIS_TIMEOUT_MS = parsePositiveInteger(
  process.env.RATE_LIMIT_REDIS_TIMEOUT_MS,
  2500
);
const upstashRedisRestUrl = trimString(process.env.UPSTASH_REDIS_REST_URL);
const upstashRedisRestToken = trimString(process.env.UPSTASH_REDIS_REST_TOKEN);
const recaptchaAllowedHostnames = trimString(process.env.RECAPTCHA_ALLOWED_HOSTNAMES)
  .split(',')
  .map((hostname) => hostname.trim().toLowerCase())
  .filter(Boolean);

const requestLogByIp = new Map<string, number[]>();
let hasWarnedMissingDurableRateLimitConfig = false;

function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePositiveNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getConfiguredSmtpHost() {
  return trimString(process.env.SMTP_HOST).toLowerCase();
}

function getTrimmedField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return trimString(value);
}

function isValidEmailAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isLikelyPhoneNumber(value: string) {
  return /^[0-9+()\-\s]{6,40}$/.test(value);
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() || 'unknown';
}

function isRateLimitedInMemory(ip: string, now = Date.now()): RateLimitResult {
  const existing = requestLogByIp.get(ip) ?? [];
  const recent = existing.filter((timestamp) => now - timestamp <= RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLogByIp.set(ip, recent);

  if (recent.length > RATE_LIMIT_MAX_REQUESTS) {
    const oldestTimestamp = recent[0] ?? now;
    const retryAfterMs = Math.max(1000, RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp));
    return {
      limited: true,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  return {
    limited: false,
    retryAfterSeconds: 0,
  };
}

async function isRateLimitedWithUpstash(ip: string): Promise<RateLimitResult> {
  if (!upstashRedisRestUrl || !upstashRedisRestToken) {
    return isRateLimitedInMemory(ip);
  }

  const key = `${RATE_LIMIT_KEY_PREFIX}:${ip}`;
  const rateLimitAbortController = new AbortController();
  const rateLimitTimeoutId = setTimeout(() => {
    rateLimitAbortController.abort();
  }, RATE_LIMIT_REDIS_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${upstashRedisRestUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashRedisRestToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, RATE_LIMIT_WINDOW_SECONDS, 'NX'],
        ['TTL', key],
      ]),
      cache: 'no-store',
      signal: rateLimitAbortController.signal,
    });
  } catch (error) {
    const requestError = error as Error;
    console.error('Durable rate limit request failed, using in-memory fallback.', {
      message: requestError.message,
      timedOut: requestError.name === 'AbortError',
      timeoutMs: RATE_LIMIT_REDIS_TIMEOUT_MS,
    });
    return isRateLimitedInMemory(ip);
  } finally {
    clearTimeout(rateLimitTimeoutId);
  }

  if (!response.ok) {
    console.error('Durable rate limit request returned non-OK status, using in-memory fallback.', {
      status: response.status,
      statusText: response.statusText,
    });
    return isRateLimitedInMemory(ip);
  }

  let payload: UpstashPipelineResult[] | null = null;
  try {
    payload = (await response.json()) as UpstashPipelineResult[] | null;
  } catch {
    console.error('Durable rate limit response was not valid JSON, using in-memory fallback.');
    return isRateLimitedInMemory(ip);
  }

  if (!Array.isArray(payload) || payload.length < 1) {
    console.error('Durable rate limit returned an unexpected response, using in-memory fallback.');
    return isRateLimitedInMemory(ip);
  }

  if (payload.some((item) => item?.error)) {
    console.error('Durable rate limit returned command errors, using in-memory fallback.', {
      commandErrors: payload.filter((item) => item?.error).map((item) => item.error),
    });
    return isRateLimitedInMemory(ip);
  }

  const count = Number(payload[0]?.result ?? Number.NaN);
  if (!Number.isFinite(count)) {
    console.error('Durable rate limit returned a non-numeric counter, using in-memory fallback.');
    return isRateLimitedInMemory(ip);
  }

  if (count > RATE_LIMIT_MAX_REQUESTS) {
    const ttl = Number(payload[2]?.result ?? Number.NaN);
    const retryAfterSeconds = Number.isFinite(ttl) && ttl > 0 ? ttl : RATE_LIMIT_WINDOW_SECONDS;
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterSeconds)),
    };
  }

  return {
    limited: false,
    retryAfterSeconds: 0,
  };
}

async function isRateLimited(ip: string): Promise<RateLimitResult> {
  if (!upstashRedisRestUrl || !upstashRedisRestToken) {
    if (!hasWarnedMissingDurableRateLimitConfig) {
      hasWarnedMissingDurableRateLimitConfig = true;
      console.warn(
        'UPSTASH_REDIS_REST_URL/TOKEN not set. Quote API is using in-memory rate limiting only.'
      );
    }

    return isRateLimitedInMemory(ip);
  }

  return isRateLimitedWithUpstash(ip);
}

async function verifyRecaptchaToken(token: string, ip: string) {
  const projectId = process.env.RECAPTCHA_PROJECT_ID;
  const apiKey = process.env.RECAPTCHA_API_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');
  const verifyTimeoutMs = parsePositiveNumber(
    process.env.RECAPTCHA_VERIFY_TIMEOUT_MS,
    10000
  );
  const expectedAction = trimString(process.env.RECAPTCHA_ACTION);

  if (!projectId || !apiKey || !siteKey) {
    console.error('Missing reCAPTCHA env vars', {
      hasApiKey: Boolean(apiKey),
      hasProjectId: Boolean(projectId),
      hasSiteKey: Boolean(siteKey),
    });

    return {
      error: 'Server reCAPTCHA settings are not configured.',
      status: 500,
      success: false as const,
    };
  }

  const verifyAbortController = new AbortController();
  const verifyTimeoutId = setTimeout(() => {
    verifyAbortController.abort();
  }, verifyTimeoutMs);

  let assessmentResponse: Response;
  try {
    assessmentResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            token,
            siteKey,
            ...(ip && ip !== 'unknown' ? { userIpAddress: ip } : {}),
          },
        }),
        cache: 'no-store',
        signal: verifyAbortController.signal,
      }
    );
  } catch (error) {
    const requestError = error as Error;
    if (requestError.name === 'AbortError') {
      console.error(`reCAPTCHA verification timed out after ${verifyTimeoutMs}ms`);
    }

    return {
      error: 'reCAPTCHA verification failed. Please try again.',
      status: 502,
      success: false as const,
    };
  } finally {
    clearTimeout(verifyTimeoutId);
  }

  const assessmentData = (await assessmentResponse
    .json()
    .catch(() => null)) as RecaptchaAssessmentResponse | null;

  if (!assessmentResponse.ok) {
    console.error('reCAPTCHA assessment request failed', {
      body: assessmentData,
      status: assessmentResponse.status,
      statusText: assessmentResponse.statusText,
    });

    return {
      error: 'reCAPTCHA verification failed. Please try again.',
      status: 502,
      success: false as const,
    };
  }

  if (assessmentData?.tokenProperties?.valid !== true) {
    console.warn('reCAPTCHA invalid token', {
      reason: assessmentData?.tokenProperties?.invalidReason ?? 'invalid-token',
    });

    return {
      error: 'reCAPTCHA verification failed. Please try again.',
      status: 400,
      success: false as const,
    };
  }

  const score = assessmentData?.riskAnalysis?.score;
  if (typeof score === 'number' && score < minScore) {
    console.warn('reCAPTCHA low score', { minScore, score });

    return {
      error: 'reCAPTCHA verification failed. Please try again.',
      status: 403,
      success: false as const,
    };
  }

  const returnedAction = trimString(assessmentData?.tokenProperties?.action);
  if (expectedAction && returnedAction && returnedAction !== expectedAction) {
    console.warn('reCAPTCHA action mismatch', {
      expectedAction,
      returnedAction,
    });

    return {
      error: 'reCAPTCHA verification failed. Please try again.',
      status: 400,
      success: false as const,
    };
  }

  if (recaptchaAllowedHostnames.length) {
    const verificationHostname = trimString(
      assessmentData?.tokenProperties?.hostname
    ).toLowerCase();

    if (!verificationHostname || !recaptchaAllowedHostnames.includes(verificationHostname)) {
      console.error('reCAPTCHA hostname mismatch.', {
        hostname: verificationHostname || '(missing)',
      });

      return {
        error: 'reCAPTCHA verification failed. Please try again.',
        status: 400,
        success: false as const,
      };
    }
  }

  return {
    success: true as const,
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await isRateLimited(ip);

    if (rateLimit.limited) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again shortly.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const formData = await req.formData();

    const website = getTrimmedField(formData, 'website');
    const captchaToken = getTrimmedField(formData, 'captchaToken');
    const name = getTrimmedField(formData, 'name');
    const phone = getTrimmedField(formData, 'phone');
    const email = getTrimmedField(formData, 'email').toLowerCase();
    const message = getTrimmedField(formData, 'message');
    const attachmentResult = validateQuoteAttachment(formData.get('attachments'));

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: 'Please complete the reCAPTCHA check.' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Name is too long.' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone is required.' },
        { status: 400 }
      );
    }

    if (phone.length > MAX_PHONE_LENGTH || !isLikelyPhoneNumber(phone)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid phone number.' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH || !isValidEmailAddress(email)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required.' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Message is too long.' },
        { status: 400 }
      );
    }

    if (attachmentResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: attachmentResult.error,
          maxBytes: QUOTE_ATTACHMENT_MAX_BYTES,
        },
        { status: 400 }
      );
    }

    const recaptchaResult = await verifyRecaptchaToken(captchaToken, ip);

    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, error: recaptchaResult.error },
        { status: recaptchaResult.status }
      );
    }

    const attachments = attachmentResult.file
      ? [
          {
            content: Buffer.from(await attachmentResult.file.arrayBuffer()),
            contentType: attachmentResult.file.type || undefined,
            filename: attachmentResult.file.name,
          },
        ]
      : [];

    try {
      await sendQuoteEmail({
        attachments,
        email,
        message,
        name,
        origin: req.headers.get('origin') ?? req.nextUrl.origin,
        phone,
      });
    } catch (error) {
      const mailError = error as MailSendError;
      console.error('SMTP send failed', {
        message: mailError.message,
        code: mailError.code,
        command: mailError.command,
        responseCode: mailError.responseCode,
        syscall: mailError.syscall,
        address: mailError.address,
        port: mailError.port,
        smtpHost: process.env.SMTP_HOST || '(missing)',
        smtpPort: Number(process.env.SMTP_PORT ?? '587'),
        smtpSecure:
          process.env.SMTP_SECURE === 'true' ||
          Number(process.env.SMTP_PORT ?? '587') === 465,
        smtpTimeoutMs: Number(process.env.SMTP_TIMEOUT_MS ?? '15000'),
        smtpAuthEnabled:
          Boolean(trimString(process.env.SMTP_USER)) &&
          Boolean(trimString(process.env.SMTP_PASS)),
      });

      const errorMessage = error instanceof Error ? error.message : '';
      const isMissingConfiguration =
        errorMessage.includes('Missing required env var') ||
        errorMessage.includes('SMTP_PORT must be a valid number') ||
        errorMessage.includes('SMTP_USER and SMTP_PASS must be set together') ||
        errorMessage.includes('SMTP_USER and SMTP_PASS are required when SMTP_HOST is smtp.gmail.com') ||
        errorMessage.includes('SMTP_NAME is required');
      const smtpHost = getConfiguredSmtpHost();
      const isRelayDenied =
        errorMessage.includes('Mail relay denied') ||
        errorMessage.includes('Invalid credentials for relay');
      const isGmailAuthError =
        (mailError.code === 'EAUTH' && smtpHost === 'smtp.gmail.com') ||
        errorMessage.includes('Username and Password not accepted') ||
        errorMessage.includes('Invalid login') ||
        errorMessage.includes('Application-specific password required') ||
        errorMessage.includes('534-5.7.9') ||
        errorMessage.includes('535-5.7.8');

      return NextResponse.json(
        {
          success: false,
          error: isMissingConfiguration
            ? EMAIL_CONFIGURATION_ERROR
            : isRelayDenied
              ? SMTP_RELAY_DENIED_ERROR
              : isGmailAuthError
                ? GMAIL_SMTP_AUTH_ERROR
              : EMAIL_DELIVERY_ERROR,
        },
        {
          status:
            isMissingConfiguration || isRelayDenied || isGmailAuthError ? 500 : 502,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Get a quote route error', error);

    return NextResponse.json(
      {
        success: false,
        error: EMAIL_DELIVERY_ERROR,
      },
      { status: 500 }
    );
  }
}
