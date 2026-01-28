import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
    }

    const projectId = process.env.RECAPTCHA_PROJECT_ID; // e.g. carlosesierra
    const apiKey = process.env.RECAPTCHA_API_KEY;       // server-only API key
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');

    if (!projectId || !apiKey || !siteKey) {
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
        event: { token, siteKey },
      }),
    });

    const data = await assessmentRes.json();

    // Token must be valid
    const valid = data?.tokenProperties?.valid === true;
    if (!valid) {
      const reason = data?.tokenProperties?.invalidReason ?? 'invalid-token';
      return NextResponse.json({ success: false, error: `Invalid token: ${reason}` }, { status: 400 });
    }

    // Score check (if present)
    const score = data?.riskAnalysis?.score;
    if (typeof score === 'number' && score < minScore) {
      return NextResponse.json({ success: false, error: `Low score (${score})`, score }, { status: 403 });
    }

    return NextResponse.json({ success: true, score: typeof score === 'number' ? score : null });
  } catch {
    return NextResponse.json({ success: false, error: 'Verification error' }, { status: 500 });
  }
}