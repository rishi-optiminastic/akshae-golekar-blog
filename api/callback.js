// Vercel serverless function: handles the GitHub OAuth redirect for Decap CMS.
// GitHub redirects here with ?code=... after the user authorizes.
// We exchange that code for an access token and post it back to the parent
// window (the /admin page) using the message format Decap expects.
//
// Required env vars on Vercel:
//   OAUTH_GITHUB_CLIENT_ID
//   OAUTH_GITHUB_CLIENT_SECRET

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(500).send("OAuth env vars not set on Vercel.");
    return;
  }

  const code = req.query && req.query.code;
  if (!code) {
    res.status(400).send("Missing ?code parameter.");
    return;
  }

  let status = "error";
  let content = { error: "unknown" };

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    if (data.access_token) {
      status = "success";
      content = { token: data.access_token, provider: "github" };
    } else {
      content = data;
    }
  } catch (err) {
    content = { error: err.message };
  }

  const message = `authorization:github:${status}:${JSON.stringify(content)}`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!doctype html>
<html>
<head><title>Authorizing…</title></head>
<body style="font-family:system-ui;padding:2rem">
  <p>Authorizing… You can close this window.</p>
  <script>
    (function () {
      function receive(e) {
        if (!e.data || typeof e.data !== "string") return;
        if (e.data !== "authorizing:github") return;
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener("message", receive, false);
      }
      window.addEventListener("message", receive, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`);
}
