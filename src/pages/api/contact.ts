import type { APIRoute } from 'astro';

// Vercel serverless function: emails contact-form submissions to CONTACT_TO_EMAIL.
// Uses Resend (https://resend.com) — set RESEND_API_KEY. Swap for SendGrid/SMTP if preferred.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL ?? 'info@floridaclinicians.org';

  if (!apiKey) {
    return json({ error: 'Contact form is not configured yet.' }, 500);
  }

  const data = await request.formData().catch(() => null);
  const name = String(data?.get('name') ?? '').trim();
  const email = String(data?.get('email') ?? '').trim();
  const message = String(data?.get('message') ?? '').trim();
  // Honeypot: bots fill hidden fields; humans don't.
  const trap = String(data?.get('company') ?? '').trim();

  if (trap) return json({ ok: true }); // silently drop bots
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return json({ error: 'Please complete all fields with a valid email.' }, 400);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      // "from" must be a domain verified in Resend.
      from: 'FCCA Website <website@floridaclinicians.org>',
      to: [to],
      reply_to: email,
      subject: `Contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (res.ok) return json({ ok: true, message: 'Thanks — your message has been sent.' });
  return json({ error: 'Could not send your message. Please try again later.' }, 502);
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
