// Vercel serverless function: starts the GitHub OAuth flow for Decap CMS.
// Called by Decap CMS when the user clicks "Login with GitHub" in /admin.
// Required env vars on Vercel:
//   OAUTH_GITHUB_CLIENT_ID

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("OAUTH_GITHUB_CLIENT_ID env var is not set on Vercel.");
    return;
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/callback`;

  const scope = (req.query && req.query.scope) || "repo,user";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    allow_signup: "false",
  });

  res.setHeader("Location", `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.status(302).end();
}
