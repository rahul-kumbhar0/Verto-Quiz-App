/**
 * Show every connected YouTube channel and check its token still works.
 * Usage: node list-channels.js
 */
import "dotenv/config";
import { google } from "googleapis";

const { YT_CLIENT_ID, YT_CLIENT_SECRET } = process.env;
const keys = Object.keys(process.env).filter((k) => /^YT_REFRESH_TOKEN(_[A-Z0-9_]+)?$/.test(k));

if (!keys.length) {
  console.log("No channels connected yet.");
  process.exit(0);
}

for (const key of keys) {
  const label = key === "YT_REFRESH_TOKEN" ? "(default)" : key.replace("YT_REFRESH_TOKEN_", "").toLowerCase();
  const oauth2 = new google.auth.OAuth2(YT_CLIENT_ID, YT_CLIENT_SECRET);
  oauth2.setCredentials({ refresh_token: process.env[key] });
  const yt = google.youtube({ version: "v3", auth: oauth2 });
  try {
    const res = await yt.channels.list({ part: ["snippet", "statistics"], mine: true });
    for (const ch of res.data.items ?? []) {
      console.log(`✅ --channel ${label} → "${ch.snippet.title}" (${ch.id}), ${ch.statistics.videoCount} videos`);
    }
    if (!res.data.items?.length) console.log(`⚠️  --channel ${label} → token works but this account has no channel`);
  } catch (err) {
    console.log(`❌ --channel ${label} → ${err.message}`);
  }
}
