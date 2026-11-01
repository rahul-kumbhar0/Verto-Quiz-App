/**
 * OAuth "device flow" to connect your YouTube channel — no localhost needed,
 * so it can run from a cloud session. You approve on your phone/browser.
 *
 * Requires an OAuth client of type "TVs and Limited Input devices"
 * (Google Cloud Console -> Credentials -> Create OAuth client ID).
 *
 * Usage:
 *   YT_CLIENT_ID=... YT_CLIENT_SECRET=... node get-refresh-token-device.js
 * or put them in youtube/.env and run: node get-refresh-token-device.js
 */
import "dotenv/config";

const { YT_CLIENT_ID, YT_CLIENT_SECRET } = process.env;
if (!YT_CLIENT_ID || !YT_CLIENT_SECRET) {
  console.error("Missing YT_CLIENT_ID / YT_CLIENT_SECRET (env or youtube/.env)");
  process.exit(1);
}

const SCOPE = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube";

// Step 1: request a device + user code
const codeRes = await fetch("https://oauth2.googleapis.com/device/code", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: YT_CLIENT_ID, scope: SCOPE }),
});
const codeData = await codeRes.json();
if (!codeRes.ok) {
  console.error("Failed to start device flow:", JSON.stringify(codeData, null, 2));
  process.exit(1);
}

console.log("\n== Approve YouTube access ==");
console.log(`1. Open:      ${codeData.verification_url}`);
console.log(`2. Enter code: ${codeData.user_code}`);
console.log(`\n(Waiting for approval, expires in ${Math.round(codeData.expires_in / 60)} minutes...)\n`);

// Step 2: poll for the token
const interval = (codeData.interval || 5) * 1000;
const deadline = Date.now() + codeData.expires_in * 1000;

while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, interval));
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: YT_CLIENT_ID,
      client_secret: YT_CLIENT_SECRET,
      device_code: codeData.device_code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    }),
  });
  const tokenData = await tokenRes.json();
  if (tokenRes.ok) {
    console.log("✅ YouTube connected! Add this to youtube/.env (or your environment secrets):\n");
    console.log(`YT_REFRESH_TOKEN=${tokenData.refresh_token}\n`);
    process.exit(0);
  }
  if (tokenData.error === "authorization_pending" || tokenData.error === "slow_down") continue;
  console.error("Authorization failed:", JSON.stringify(tokenData, null, 2));
  process.exit(1);
}

console.error("Timed out waiting for approval. Run the script again.");
process.exit(1);
