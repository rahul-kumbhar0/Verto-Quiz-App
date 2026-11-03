/**
 * Upload a video to the connected YouTube channel.
 *
 * Usage:
 *   node upload.js --file ./video.mp4 --title "My Title" [--description "..."] [--tags "a,b,c"] [--privacy public|unlisted|private] [--shorts]
 *
 * Requires YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN in youtube/.env
 * (run `npm run auth` once to get the refresh token — see README.md).
 */
import "dotenv/config";
import fs from "node:fs";
import { google } from "googleapis";

function getArg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const file = getArg("file");
const title = getArg("title");
const description = getArg("description", "");
const tags = (getArg("tags", "") || "").split(",").map((t) => t.trim()).filter(Boolean);
const privacyStatus = getArg("privacy", "private"); // safe default; pass --privacy public to publish
const isShorts = process.argv.includes("--shorts");

if (!file || !title) {
  console.error('Usage: node upload.js --file ./video.mp4 --title "My Title" [--description ...] [--tags a,b,c] [--privacy private|unlisted|public] [--shorts]');
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

// --channel <label> picks YT_REFRESH_TOKEN_<LABEL>; without it the default YT_REFRESH_TOKEN is used.
const channel = getArg("channel");
const tokenKey = channel ? `YT_REFRESH_TOKEN_${channel.toUpperCase().replace(/[^A-Z0-9]/g, "_")}` : "YT_REFRESH_TOKEN";
const { YT_CLIENT_ID, YT_CLIENT_SECRET } = process.env;
const YT_REFRESH_TOKEN = process.env[tokenKey];
if (!YT_CLIENT_ID || !YT_CLIENT_SECRET || !YT_REFRESH_TOKEN) {
  console.error(`Missing YT_CLIENT_ID / YT_CLIENT_SECRET / ${tokenKey} in youtube/.env — connect the channel first (see README.md).`);
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(YT_CLIENT_ID, YT_CLIENT_SECRET);
oauth2.setCredentials({ refresh_token: YT_REFRESH_TOKEN });

const youtube = google.youtube({ version: "v3", auth: oauth2 });

// YouTube detects Shorts automatically from vertical aspect ratio + <=3min,
// but adding #Shorts to the title/description helps.
const finalTitle = isShorts && !/#shorts/i.test(title) ? `${title} #Shorts` : title;

console.log(`Uploading "${finalTitle}" (${privacyStatus}) ...`);

const res = await youtube.videos.insert({
  part: ["snippet", "status"],
  requestBody: {
    snippet: {
      title: finalTitle,
      description,
      tags,
      categoryId: "27", // Education
    },
    status: {
      privacyStatus,
      selfDeclaredMadeForKids: false,
    },
  },
  media: {
    body: fs.createReadStream(file),
  },
});

console.log("✅ Uploaded!");
console.log(`Video ID:  ${res.data.id}`);
console.log(`Watch URL: https://www.youtube.com/watch?v=${res.data.id}`);
