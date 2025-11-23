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

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('Missing RECAPTCHA_SECRET_KEY');
    return NextResponse.json(
      { success: false, error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  // Verify with Google
  const verifyRes = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(
        secretKey
      )}&response=${encodeURIComponent(captchaToken)}`,
    }
  );

  const verifyData = (await verifyRes.json()) as {
    success: boolean;
    'error-codes'?: string[];
  };

  if (!verifyData.success) {
    console.error('reCAPTCHA failed:', verifyData['error-codes']);
    return NextResponse.json(
      { success: false, error: 'Failed captcha verification' },
      { status: 400 }
    );
  }

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