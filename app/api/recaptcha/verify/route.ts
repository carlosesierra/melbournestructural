import { NextResponse } from 'next/server';

type VerifyBody = {
  token?: string;
  action?: string; // optional expectedAction
};

export async function POST(req: Request) {
  try {
    const { token, action } = (await req.json()) as VerifyBody;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token' },
        { status: 400 }
      );
    }

    const projectId = process.env.RECAPTCHA_PROJECT_ID; // e.g. carlosesierra
    const apiKey = process.env.RECAPTCHA_API_KEY; // server-only API key
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');

    if (!projectId || !apiKey || !siteKey) {
      console.error('reCAPTCHA verify: Missing env vars', {
        hasProjectId: Boolean(projectId),
        hasApiKey: Boolean(apiKey),
        hasSiteKey: Boolean(siteKey),
      });
      return NextResponse.json(
        { success: false, error: 'Server reCAPTCHA env vars not configured' },
        { status: 500 }
      );
    }

    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

    const assessmentRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          ...(action ? { expectedAction: action } : {}),
        },
      }),
    });

    // ✅ 1) Explicitly handle non-OK responses
    const data = await assessmentRes.json().catch(() => ({} as any));

    if (!assessmentRes.ok) {
      console.error('reCAPTCHA Enterprise assessment API error', {
        status: assessmentRes.status,
        statusText: assessmentRes.statusText,
        data,
      });
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA assessment request failed' },
        { status: 502 }
      );
    }

    // Token must be valid
    const valid = data?.tokenProperties?.valid === true;
    if (!valid) {
      const reason = data?.tokenProperties?.invalidReason ?? 'invalid-token';
      console.warn('reCAPTCHA invalid token', { reason });
      return NextResponse.json(
        { success: false, error: `Invalid token: ${reason}` },
        { status: 400 }
      );
    }

    // ✅ 2) Validate action if provided
    const returnedAction = data?.tokenProperties?.action;
    if (action && returnedAction && returnedAction !== action) {
      console.warn('reCAPTCHA action mismatch', {
        expected: action,
        got: returnedAction,
      });
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA action mismatch' },
        { status: 400 }
      );
    }

    // Score check (if present)
    const score = data?.riskAnalysis?.score;
    if (typeof score === 'number' && score < minScore) {
      console.warn('reCAPTCHA low score', { score, minScore });
      return NextResponse.json(
        { success: false, error: `Low score (${score})`, score },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, score: typeof score === 'number' ? score : null },
      { status: 200 }
    );
  } catch (err) {
    console.error('reCAPTCHA verify route error', err);
    return NextResponse.json(
      { success: false, error: 'Verification error' },
      { status: 500 }
    );
  }
}