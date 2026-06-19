import type { APIRoute } from 'astro';

/**
 * Decap CMS GitHub OAuth — step 1 of 2.
 *
 * Decap opens this endpoint in a popup; we redirect to GitHub's authorize
 * screen. GitHub then calls back to /api/callback. Runs as a Vercel
 * serverless function so the client secret never reaches the browser.
 *
 * Required Vercel env vars:
 *   OAUTH_GITHUB_CLIENT_ID
 *   OAUTH_GITHUB_CLIENT_SECRET   (used in /api/callback)
 * Register the GitHub OAuth App callback URL as: https://<site>/api/callback
 */
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('OAuth is not configured (missing OAUTH_GITHUB_CLIENT_ID).', {
      status: 500,
    });
  }

  const url = new URL(request.url);
  const scope = url.searchParams.get('scope') || 'repo';
  // CSRF state — echoed back and verified in the callback.
  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/api/callback`;

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // Short-lived, http-only state cookie verified on callback.
      'Set-Cookie': `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
};
