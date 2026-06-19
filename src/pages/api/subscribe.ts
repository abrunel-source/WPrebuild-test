import type { APIRoute } from 'astro';

// Runs as a Vercel serverless function so the Mailchimp key never reaches the browser.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.MAILCHIMP_API_KEY;
  const audienceId = import.meta.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return json({ error: 'Newsletter is not configured yet.' }, 500);
  }

  let email = '';
  try {
    const data = await request.formData();
    email = String(data.get('email') ?? '').trim();
  } catch {
    const body = await request.json().catch(() => ({}));
    email = String(body.email ?? '').trim();
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  // Datacenter is the suffix of the key, e.g. "...-us4" -> "us4".
  const dc = apiKey.split('-')[1];
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
    },
    body: JSON.stringify({ email_address: email, status: 'pending' }), // double opt-in
  });

  if (res.ok) {
    return json({ ok: true, message: 'Almost there — check your inbox to confirm.' });
  }

  const err = await res.json().catch(() => ({}));
  // Already-subscribed is not a real error to the visitor.
  if (err.title === 'Member Exists') {
    return json({ ok: true, message: "You're already subscribed — thank you!" });
  }
  return json({ error: 'Subscription failed. Please try again later.' }, 502);
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
