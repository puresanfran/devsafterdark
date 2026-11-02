import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const PORTAL_ID = '19659375';
const FORM_GUID = '926d6e04-9f65-4cd6-be3c-8b1c844fc70e';
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting: max 3 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { firstname, lastname, email, whats_the_angle, message, _gotcha } = await req.json();

  // Honeypot: bots fill this, humans don't
  if (_gotcha) {
    return NextResponse.json({ ok: true });
  }

  if (!firstname || !lastname || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const fields = [
    { name: 'firstname', value: firstname },
    { name: 'lastname', value: lastname },
    { name: 'email', value: email },
    { name: 'message', value: message },
  ];
  if (whats_the_angle) fields.push({ name: 'whats_the_angle', value: whats_the_angle });

  // Submit to HubSpot
  const hsRes = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields,
        context: { pageUri: 'https://devsafterdark.com', pageName: 'Developers After Dark' },
      }),
    }
  );

  if (!hsRes.ok) {
    const err = await hsRes.text();
    console.error('HubSpot submit error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }

  // Send notification email via Resend
  await resend.emails.send({
    from: 'Devs After Dark Pitches <pitches@devsafterdark.com>',
    to: 'hello@devsafterdark.com',
    replyTo: email,
    subject: `New pitch from ${firstname} ${lastname}`,
    html: `
      <p><strong>Name:</strong> ${firstname} ${lastname}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${whats_the_angle ? `<p><strong>What's the angle:</strong> ${whats_the_angle}</p>` : ''}
      <hr>
      <p><strong>The pitch:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `Name: ${firstname} ${lastname}\nEmail: ${email}\n${whats_the_angle ? `Angle: ${whats_the_angle}\n` : ''}\nPitch:\n${message}`,
  }).catch(err => console.error('Resend error:', err));

  return NextResponse.json({ ok: true });
}
