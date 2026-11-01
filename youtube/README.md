# YouTube Automation Setup

Connect your YouTube channel so Claude can generate videos and upload them to your channel — the same workflow as the Instagram setup, but for YouTube.

There is **no ready-made YouTube connector** in Claude's connector directory (only analytics tools), so the connection is made directly with Google's **YouTube Data API v3** using OAuth. This is a one-time setup (~10 minutes).

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com/
2. Sign in with the **Google account that owns your YouTube channel**.
3. Click the project dropdown (top bar) → **New Project** → name it e.g. `youtube-automation` → **Create**.

## 2. Enable the YouTube Data API v3

1. In the console, go to **APIs & Services → Library**.
2. Search for **YouTube Data API v3** → open it → click **Enable**.

## 3. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** → fill in app name (e.g. `YT Uploader`), your email for support and developer contact → save through the steps.
3. Under **Audience → Test users**, click **Add users** and add your own Gmail address. (While the app is in "Testing" mode, only test users can authorize it — that's fine, it's just you. Note: refresh tokens for apps in Testing mode expire after 7 days; click **Publish app** on the consent screen to make the token permanent.)

## 4. Create OAuth credentials

1. Go to **APIs & Services → Credentials** → **Create Credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Under **Authorized redirect URIs**, add: `http://localhost:8080`
4. Click **Create** and copy the **Client ID** and **Client Secret**.

## 5. Authorize your channel (one time)

**Easiest option — let Claude run it (device flow):** create the OAuth client as type **"TVs and Limited Input devices"** instead of "Web application" (no redirect URI needed), paste the Client ID and Secret to Claude, and Claude runs `node get-refresh-token-device.js` from its cloud session. You just open the link it gives you, enter the short code, and approve. Done.

**Or run it yourself locally (web flow):**

On your own computer (needs a browser):

```bash
cd youtube
npm install
cp .env.example .env
# put YT_CLIENT_ID and YT_CLIENT_SECRET into .env, then:
npm run auth
```

Open the printed URL, sign in, approve access. The script prints your **refresh token** — add it to `.env` as `YT_REFRESH_TOKEN`.

Your channel is now connected. The refresh token never expires (once the app is published), so this is truly one-time.

## 6. Upload a video

```bash
node upload.js --file ./quiz-short.mp4 --title "Daily Quiz #1" --description "Can you answer this?" --tags "quiz,trivia" --privacy public --shorts
```

- `--privacy` defaults to `private` so test uploads stay hidden; use `public` to publish.
- `--shorts` appends `#Shorts` to the title (YouTube auto-detects Shorts from vertical ≤3 min videos).

## 7. Let Claude use it

So Claude (cloud sessions) can upload without your laptop, add these three values as **environment secrets** in your Claude Code cloud environment settings:

- `YT_CLIENT_ID`
- `YT_CLIENT_SECRET`
- `YT_REFRESH_TOKEN`

Then the workflow matches Instagram:

1. Claude generates a video (Video Create connector — same as the Instagram reels).
2. Claude downloads the finished MP4.
3. Claude runs `node youtube/upload.js --file ... --title ... --privacy public` to publish it to your channel.
4. (Optional) A scheduled task can run this daily, fully automated.

## Quota note

The free YouTube API quota is 10,000 units/day; one upload costs 1,600 units → about **6 uploads per day**, which is plenty for a daily-posting automation.
