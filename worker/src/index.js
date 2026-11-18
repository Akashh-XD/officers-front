/**
 * Cloudflare Worker starter for Telegram membership verification.
 * Configure secrets with `wrangler secret put TELEGRAM_BOT_TOKEN` and
 * `wrangler secret put TELEGRAM_CHANNEL_ID` (numeric channel ID, e.g. -100...).
 * Never put the bot token in VITE_* frontend variables.
 */
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(request.url);
    if (url.pathname !== '/telegram/verify' || request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: cors });
    }
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHANNEL_ID) {
      return new Response(JSON.stringify({ error: 'Telegram verification is not configured.' }), { status: 503, headers: cors });
    }
    try {
      const body = await request.json();
      const telegramUserId = Number(body.telegramUserId);
      if (!Number.isSafeInteger(telegramUserId) || telegramUserId <= 0) {
        return new Response(JSON.stringify({ error: 'A valid Telegram user ID is required.' }), { status: 400, headers: cors });
      }
      const api = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getChatMember`;
      const tg = await fetch(api, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHANNEL_ID, user_id: telegramUserId })
      });
      const result = await tg.json();
      if (!tg.ok || !result.ok) {
        return new Response(JSON.stringify({ error: 'Could not verify membership. Ensure the bot is an administrator of the channel.' }), { status: 502, headers: cors });
      }
      const status = result.result?.status;
      const isMember = ['creator','administrator','member'].includes(status) || (status === 'restricted' && result.result?.is_member === true);
      return new Response(JSON.stringify({ verified: isMember, status: isMember ? 'member' : 'not_member', channel: '@' + (env.TELEGRAM_CHANNEL_USERNAME || 'theUnKnown_World') }), { status: 200, headers: cors });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400, headers: cors });
    }
  }
};
