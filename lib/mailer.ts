import nodemailer from 'nodemailer';

type QuoteMailAttachment = {
  content: Buffer;
  contentType?: string;
  filename: string;
};

type QuoteMailPayload = {
  attachments: QuoteMailAttachment[];
  email: string;
  message: string;
  name: string;
  origin?: string | null;
  phone: string;
};

type MailConfig = {
  envelopeFrom: string;
  fromAddress: string;
  fromHeader: string;
  host: string;
  port: number;
  previewTo?: string;
  requireTls: boolean;
  secure: boolean;
  smtpName?: string;
  timeoutMs: number;
  to: string;
  user?: string;
  pass?: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function getDomainFromEmail(address: string) {
  const [, domain = ''] = address.split('@');

  return domain.trim().toLowerCase();
}

function isGmailSmtpHost(host: string) {
  return host.trim().toLowerCase() === 'smtp.gmail.com';
}

function getAddressFromMailbox(value: string) {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim().replace(/^"|"$/g, '');
}

function parsePositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function splitRecipientList(value: string) {
  return value
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

function getRequiredEnv(name: string) {
  const value = getOptionalEnv(name);

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

function getMailConfig(): MailConfig {
  const host = getRequiredEnv('SMTP_HOST');
  const port = Number(process.env.SMTP_PORT ?? '587');

  if (Number.isNaN(port)) {
    throw new Error('SMTP_PORT must be a valid number');
  }

  const user = getOptionalEnv('SMTP_USER');
  const pass = getOptionalEnv('SMTP_PASS');

  if ((user && !pass) || (!user && pass)) {
    throw new Error('SMTP_USER and SMTP_PASS must be set together');
  }

  if (isGmailSmtpHost(host) && (!user || !pass)) {
    throw new Error('SMTP_USER and SMTP_PASS are required when SMTP_HOST is smtp.gmail.com');
  }

  const configuredFrom =
    getOptionalEnv('SMTP_FROM') ?? getOptionalEnv('FORM_FROM') ?? '';
  const fromAddress = getAddressFromMailbox(configuredFrom);
  const to = getOptionalEnv('SMTP_TO') ?? getOptionalEnv('FORM_TO') ?? '';
  const envelopeFrom = getOptionalEnv('SMTP_ENVELOPE_FROM') ?? fromAddress;
  const smtpName = getOptionalEnv('SMTP_NAME') ?? getDomainFromEmail(fromAddress);

  if (!configuredFrom || !fromAddress) {
    throw new Error('Missing required env var: SMTP_FROM or FORM_FROM');
  }

  if (!to) {
    throw new Error('Missing required env var: SMTP_TO or FORM_TO');
  }

  if (!smtpName) {
    throw new Error(
      'SMTP_NAME is required when SMTP_FROM or FORM_FROM does not include a valid domain'
    );
  }

  return {
    envelopeFrom,
    fromAddress,
    fromHeader:
      getOptionalEnv('SMTP_FROM') ??
      `"${getOptionalEnv('FORM_SENDER_NAME') ?? 'Melbourne Structural Website'}" <${fromAddress}>`,
    host,
    pass,
    port,
    previewTo: getOptionalEnv('FORM_PREVIEW_TO'),
    requireTls: process.env.SMTP_REQUIRE_TLS !== 'false',
    secure: process.env.SMTP_SECURE === 'true',
    smtpName,
    timeoutMs: parsePositiveNumber(process.env.SMTP_TIMEOUT_MS, 15000),
    to,
    user,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatMultilineHtml(value: string) {
  return escapeHtml(value).replaceAll('\n', '<br />');
}

function getTransporter(config: MailConfig) {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    auth: config.user && config.pass ? { pass: config.pass, user: config.user } : undefined,
    connectionTimeout: config.timeoutMs,
    greetingTimeout: config.timeoutMs,
    host: config.host,
    name: config.smtpName,
    port: config.port,
    requireTLS: config.requireTls,
    secure: config.secure,
    socketTimeout: config.timeoutMs,
  });

  return cachedTransporter;
}

export function getQuoteRecipient() {
  const config = getMailConfig();
  const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';

  if (isPreviewDeployment && config.previewTo) {
    return config.previewTo;
  }

  return config.to;
}

export async function sendQuoteEmail(payload: QuoteMailPayload) {
  const config = getMailConfig();
  const transporter = getTransporter(config);
  const recipient = getQuoteRecipient();
  const envelopeRecipients = splitRecipientList(recipient);
  const subject = `Website enquiry from ${payload.name}`;
  const originLine = payload.origin ? `Submitted from: ${payload.origin}` : null;
  const textBody = [
    'New website enquiry',
    '',
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    originLine,
    '',
    'Message:',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n');
  const htmlBody = `
    <h2>New website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${
      payload.origin
        ? `<p><strong>Submitted from:</strong> ${escapeHtml(payload.origin)}</p>`
        : ''
    }
    <p><strong>Message:</strong></p>
    <p>${formatMultilineHtml(payload.message)}</p>
  `;

  await transporter.sendMail({
    attachments: payload.attachments,
    envelope: {
      from: config.envelopeFrom,
      to: envelopeRecipients,
    },
    from: config.fromHeader,
    html: htmlBody,
    replyTo: `"${payload.name}" <${payload.email}>`,
    subject,
    text: textBody,
    to: recipient,
  });
}
