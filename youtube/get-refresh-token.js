/**
 * One-time OAuth flow to connect your YouTube channel.
 *
 * Usage:
 *   1. Fill YT_CLIENT_ID and YT_CLIENT_SECRET in youtube/.env
 *   2. Run: npm run auth
 *   3. Open the printed URL in your browser, sign in with the Google
 *      account that owns the YouTube channel, and approve access.
 *   4. The script catches the redirect on http://localhost:8080,
 *      prints your refresh token, and exits.
 *   5. Put the refresh token in youtube/.env as YT_REFRESH_TOKEN.
 */
import "dotenv/config";
import http from "node:http";
import { google } from "googleapis";

const { YT_CLIENT_ID, YT_CLIENT_SECRET } = process.env;
if (!YT_CLIENT_ID || !YT_CLIENT_SECRET) {
  console.error("Missing YT_CLIENT_ID / YT_CLIENT_SECRET in youtube/.env");
  process.exit(1);
}

const REDIRECT_URI = "http://localhost:8080";
const oauth2 = new google.auth.OAuth2(YT_CLIENT_ID, YT_CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline", // required to get a refresh token
  prompt: "consent",      // force a refresh token even on re-auth
  scope: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"],
});

console.log("\nOpen this URL in your browser and approve access:\n");
console.log(authUrl + "\n");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  if (!code) {
    res.end("No code in request.");
    return;
  }
  const { tokens } = await oauth2.getToken(code);
  res.end("YouTube connected! You can close this tab and return to the terminal.");
  console.log("\n✅ Success! Add this line to youtube/.env:\n");
  console.log(`YT_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  server.close();
  process.exit(0);
});

server.listen(8080, () => console.log("Waiting for Google to redirect to http://localhost:8080 ..."));
