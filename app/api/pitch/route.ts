import { NextRequest, NextResponse } from 'next/server';

const PORTAL_ID = '19659375';
const FORM_GUID = '926d6e04-9f65-4cd6-be3c-8b1c844fc70e';

export async function POST(req: NextRequest) {
  const { firstname, lastname, email, whats_the_angle, message } = await req.json();

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

  const res = await fetch(
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

  if (!res.ok) {
    const err = await res.text();
    console.error('HubSpot submit error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
