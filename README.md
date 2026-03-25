This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Form Delivery

The quote form posts multipart `FormData` to `app/api/get-a-quote/route.ts`, preserves file uploads, verifies reCAPTCHA server-side, rate limits requests, and sends mail from the server with Nodemailer.

Recommended on Vercel: use authenticated Gmail SMTP with a real Google Workspace mailbox. This avoids Vercel Static IPs and works with the current Nodemailer setup.

## Vercel Environment Setup

Add environment variables in `Project Settings > Environment Variables`.

Important:

- Values entered in the Vercel UI are stored literally. Do not wrap values in quotes there unless you want the quote characters to become part of the value.
- `.env.local` examples in this README use shell-style quoting where helpful. In Vercel UI, enter `Melbourne Structural Website <noreply@melbournestructural.com.au>` without surrounding quotes.
- After changing any Vercel environment variable, redeploy the project. Existing deployments do not pick up the new values automatically.
- `NEXT_PUBLIC_*` values are exposed to the browser. SMTP and server reCAPTCHA values are server-only.

Recommended Vercel `Production` values:

```bash
NEXT_PUBLIC_CONTACT_SUBMIT_TIMEOUT_MS=15000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

RECAPTCHA_PROJECT_ID=
RECAPTCHA_API_KEY=
RECAPTCHA_MIN_SCORE=0.5
RECAPTCHA_VERIFY_TIMEOUT_MS=10000
RECAPTCHA_ACTION=contact
RECAPTCHA_ALLOWED_HOSTNAMES=www.melbournestructural.com.au,melbournestructural.com.au

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_REQUIRE_TLS=true
SMTP_USER=info@soiltestmelbourne.com.au
SMTP_PASS=
SMTP_NAME=soiltestmelbourne.com.au
SMTP_FROM=Melbourne Structural Website <noreply@melbournestructural.com.au>
SMTP_ENVELOPE_FROM=info@soiltestmelbourne.com.au
SMTP_TO=info@melbournestructural.com.au
SMTP_TIMEOUT_MS=15000
```

Recommended Vercel `Preview` additions:

```bash
FORM_PREVIEW_TO=
```

Preview notes:

- Set `FORM_PREVIEW_TO` to an internal test inbox so preview deployments do not send live enquiries to the production inbox.
- If preview form submissions need to pass reCAPTCHA, include the preview hostname in the Google reCAPTCHA configuration and update `RECAPTCHA_ALLOWED_HOSTNAMES` accordingly. If you only test forms on production, keep preview locked down and use `FORM_PREVIEW_TO` for safety.

Optional Vercel additions:

```bash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RATE_LIMIT_WINDOW_SECONDS=600
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_KEY_PREFIX=quote
RATE_LIMIT_REDIS_TIMEOUT_MS=2500
```

If the Upstash values are omitted, the API falls back to in-memory rate limiting. That works, but it is weaker on Vercel because serverless instances do not share memory.

Reference `.env.local` values:

```bash
NEXT_PUBLIC_CONTACT_SUBMIT_TIMEOUT_MS=15000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

RECAPTCHA_PROJECT_ID=
RECAPTCHA_API_KEY=
RECAPTCHA_MIN_SCORE=0.5
RECAPTCHA_VERIFY_TIMEOUT_MS=10000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_REQUIRE_TLS=true
SMTP_USER=info@soiltestmelbourne.com.au
SMTP_PASS=
SMTP_NAME=soiltestmelbourne.com.au
SMTP_FROM="Melbourne Structural Website <noreply@melbournestructural.com.au>"
SMTP_ENVELOPE_FROM=info@soiltestmelbourne.com.au
SMTP_TO=info@melbournestructural.com.au
SMTP_TIMEOUT_MS=15000
```

Optional `.env.local` values:

```bash
RECAPTCHA_ACTION=
RECAPTCHA_ALLOWED_HOSTNAMES=www.melbournestructural.com.au,melbournestructural.com.au,localhost

FORM_FROM=info@soiltestmelbourne.com.au
FORM_TO=info@melbournestructural.com.au
FORM_SENDER_NAME="Melbourne Structural Website"
FORM_PREVIEW_TO=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RATE_LIMIT_WINDOW_SECONDS=600
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_KEY_PREFIX=quote
RATE_LIMIT_REDIS_TIMEOUT_MS=2500

NEXT_ALLOWED_DEV_ORIGINS=192.168.0.111
```

Notes:

- This repo keeps the existing multipart upload flow and checkbox reCAPTCHA, so unlike `structural-assessments` it stays on the Enterprise assessment API instead of the `siteverify` secret-key flow.
- `SMTP_FROM` and `SMTP_TO` are now the preferred mail env names to match the reference repo more closely. `FORM_FROM` and `FORM_TO` still work as fallbacks.
- When `SMTP_HOST=smtp.gmail.com`, `SMTP_USER` and `SMTP_PASS` are required.
- For Google Workspace on `smtp.gmail.com`, `SMTP_PASS` should be an app password for the mailbox in `SMTP_USER`.
- `SMTP_TO` can be the Google Workspace alias `info@melbournestructural.com.au` if that alias routes to `info@soiltestmelbourne.com.au`.
- `SMTP_FROM` should normally be the same mailbox as `SMTP_USER`, or a send-as alias already configured on that mailbox.
- If `SMTP_NAME` is omitted, the app defaults it to the domain part of the sender address extracted from `SMTP_FROM` or `FORM_FROM`.
- If `FORM_PREVIEW_TO` is set, Vercel preview deployments send mail to that address instead of the production inbox.
- If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are not set, the API falls back to in-memory rate limiting.
- `NEXT_ALLOWED_DEV_ORIGINS` maps to Next.js `allowedDevOrigins` for local network dev access.
- The route is pinned to the `syd1` Vercel region, but the authenticated Gmail SMTP path does not require Vercel Static IPs.
- If you later switch back to `smtp-relay.gmail.com`, you will need Google Workspace SMTP relay allowlisting and stable outbound IPs such as Vercel Static IPs.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
