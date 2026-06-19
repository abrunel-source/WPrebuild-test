import type { APIRoute } from 'astro';

/**
 * Decap CMS GitHub OAuth — step 2 of 2.
 *
 * GitHub redirects here with ?code & ?state. We verify the state cookie,
 * exchange the code for an access token (server-side, with the client
 * secret), then hand the token back to the Decap window via postMessage
 * using the handshake Decap/Netlify CMS expects.
 */
export const prerender = false;

function page(status: 'success' | 'error', payload: unknown) {
  const body = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html><html><body><script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(body)}, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
  </script><p>${status === 'success' ? 'Signing you in…' : 'Authentication failed.'}</p></body></html>`;
}

function html(content: string, status = 200) {
  return new Response(content, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Clear the state cookie now that it's been used.
      'Set-Cookie': 'decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.OAUTH_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return html(page('error', 'OAuth is not configured on the server.'), 500);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Verify CSRF state against the cookie set in /api/auth.
  const cookie = request.headers.get('cookie') || '';
  const expected = cookie.match(/decap_oauth_state=([^;]+)/)?.[1];
  if (!code || !state || !expected || state !== expected) {
    return html(page('error', 'Invalid OAuth state. Please try signing in again.'), 400);
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string };
    if (!data.access_token) {
      return html(page('error', data.error || 'Could not obtain an access token.'), 502);
    }
    return html(page('success', { token: data.access_token, provider: 'github' }));
  } catch {
    return html(page('error', 'Token exchange failed.'), 502);
  }
};
