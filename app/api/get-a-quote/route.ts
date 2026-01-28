// app/api/get-a-quote/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const captchaToken = formData.get('captchaToken');
  if (!captchaToken || typeof captchaToken !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Missing captcha token' },
      { status: 400 }
    );
  }

  // --- reCAPTCHA Enterprise verification (assessments) ---
  const projectId = process.env.RECAPTCHA_PROJECT_ID; // e.g. "carlosesierra"
  const apiKey = process.env.RECAPTCHA_API_KEY; // server-only API key (NOT the site key)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY; // public site key
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');

  if (!projectId || !apiKey || !siteKey) {
    console.error('Missing reCAPTCHA Enterprise env vars');
    return NextResponse.json(
      { success: false, error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

  const assessmentRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: {
        token: captchaToken,
        siteKey,
        // expectedAction: 'get_a_quote', // optional
      },
    }),
  });

  const assessmentData = (await assessmentRes.json()) as any;

  // Token must be valid
  const valid = assessmentData?.tokenProperties?.valid === true;
  if (!valid) {
    const reason = assessmentData?.tokenProperties?.invalidReason ?? 'invalid-token';
    console.error('reCAPTCHA Enterprise invalid token:', reason);
    return NextResponse.json(
      { success: false, error: `Invalid reCAPTCHA token: ${reason}` },
      { status: 400 }
    );
  }

  // Risk score is typically present (0.0 - 1.0). If present, enforce it.
  const score = assessmentData?.riskAnalysis?.score;
  if (typeof score === 'number' && score < minScore) {
    console.warn('reCAPTCHA Enterprise low score:', score);
    return NextResponse.json(
      { success: false, error: `Low reCAPTCHA score (${score})`, score },
      { status: 403 }
    );
  }
  // --- end reCAPTCHA Enterprise verification ---

  // ✅ At this point captcha is valid – process the quote
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  const address = formData.get('address');
  const projectType = formData.get('projectType');

  console.log('New quote request:', {
    name,
    email,
    message,
    address,
    projectType,
  });

  // TODO: send email via your preferred method (Nodemailer/SES/etc.)

  return NextResponse.json({ success: true });
}