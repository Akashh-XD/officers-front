# OFFICER'S FRONT

A defence-examination preparation platform starter for CDS, AFCAT and NDA.

## Included in this first development build

- Responsive student portal with dark/light appearance
- Dashboard and CDS/AFCAT/NDA examination cards
- Login and registration UI (Supabase Auth when configured; local demo mode otherwise)
- Working sample test flow: timer, question palette, answer selection, mark for review, submit confirmation, negative marking and answer review
- Topic practice sample, resources/current-affairs placeholders, leaderboard and profile pages
- Admin Studio UI scaffold
- Supabase database schema starter
- Cloudflare Worker endpoint starter for Telegram channel membership verification

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite.

The default `.env.example` enables demo mode. Demo accounts and attempts are stored in this browser's local storage and are not real secure accounts. Do not use demo mode for a public production launch.

## Connect Supabase

1. Create a Supabase project.
2. Copy Project URL and anon/public key into `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_DEMO_MODE=false
VITE_TELEGRAM_CHANNEL_URL=https://t.me/theUnKnown_World
```

3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. Enable Email auth in Supabase Authentication settings.
5. Configure email confirmation and redirect URLs for your deployed domain.

The SQL is an initial schema, not a complete production security policy. In particular, the sample question runner currently uses local sample questions. Before production, correct answers must be hidden from student queries and scoring must run server-side.

## Telegram membership verification

The Worker in `worker/src/index.js` provides a starter endpoint:

`POST /telegram/verify` with `{ "telegramUserId": 123456789 }`

Deploy it using Wrangler from the `worker` directory:

```bash
npm install -g wrangler
wrangler login
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHANNEL_ID
wrangler deploy
```

- Add your Telegram bot as an administrator of the public channel `@theUnKnown_World`.
- `TELEGRAM_CHANNEL_ID` must be the channel's numeric chat ID, normally beginning with `-100`.
- Set `ALLOWED_ORIGIN` to the exact production website origin as a Worker variable.
- The browser must not be allowed to submit an arbitrary Telegram user ID as proof of identity. Production onboarding must bind the Telegram account to the signed-in student using a one-time challenge/deep-link flow, validate it server-side, and then persist the verified Telegram ID. That binding flow is intentionally not claimed as complete in this starter.

## Deployment architecture

- Frontend: Cloudflare Pages, Vercel or Netlify (GitHub integration)
- Database/Auth: Supabase
- Telegram verification API: Cloudflare Workers
- Source control: GitHub

For a simple frontend deployment, connect this repository to Cloudflare Pages and use `npm run build` with output directory `dist`.

## Important before public launch

- Replace demo sample questions with properly licensed/owned question content.
- Verify the latest official CDS/AFCAT/NDA pattern and marking scheme before publishing each test.
- Implement server-side test creation, attempt submission, scoring and answer-key release.
- Add admin role provisioning and strict admin-only database policies.
- Implement secure Telegram account linking and membership rechecks.
- Add rate limits, audit logs, backups, privacy policy, terms and contact/support details.
- Add accessible keyboard navigation and test on real mobile devices.

This is a functional first milestone and development foundation, not yet a production-ready examination service.
