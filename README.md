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

For production on Vercel with Google Workspace SMTP relay, configure Vercel Static IPs and allowlist those IPs in Google Workspace SMTP relay before enabling the form.

Required environment variables:

```bash
NEXT_PUBLIC_CONTACT_SUBMIT_TIMEOUT_MS=15000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

RECAPTCHA_PROJECT_ID=
RECAPTCHA_API_KEY=
RECAPTCHA_MIN_SCORE=0.5
RECAPTCHA_VERIFY_TIMEOUT_MS=10000

SMTP_HOST=smtp-relay.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_NAME=soiltestmelbourne.com.au
SMTP_FROM="Melbourne Structural Website <info@soiltestmelbourne.com.au>"
SMTP_TO=info@melbournestructural.com.au
SMTP_TIMEOUT_MS=15000
```

Optional environment variables:

```bash
RECAPTCHA_ACTION=
RECAPTCHA_ALLOWED_HOSTNAMES=www.melbournestructural.com.au,melbournestructural.com.au,localhost

SMTP_USER=
SMTP_PASS=
SMTP_ENVELOPE_FROM=info@soiltestmelbourne.com.au

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
- `SMTP_TO` can be the Google Workspace alias `info@melbournestructural.com.au` if that alias routes to `info@soiltestmelbourne.com.au`.
- `SMTP_FROM` should be a real Google Workspace mailbox that your SMTP relay policy allows as a sender.
- If `SMTP_NAME` is omitted, the app defaults it to the domain part of the sender address extracted from `SMTP_FROM` or `FORM_FROM`.
- If `FORM_PREVIEW_TO` is set, Vercel preview deployments send mail to that address instead of the production inbox.
- If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are not set, the API falls back to in-memory rate limiting.
- `NEXT_ALLOWED_DEV_ORIGINS` maps to Next.js `allowedDevOrigins` for local network dev access.
- The route is pinned to the `syd1` Vercel region to keep relay traffic predictable.
- Local development uses your current machine's public IP, not Vercel. With IP-allowlisted Google SMTP relay, local sends fail unless you temporarily allowlist your current public IP in Workspace.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
