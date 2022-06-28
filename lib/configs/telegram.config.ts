import { Telegraf } from 'telegraf';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    'Please define the TELEGRAM_BOT_TOKEN environment variable inside .env.local',
  );
}

let bot: Telegraf;

async function tgConnect() {
  if (bot) {
    return bot;
  }

  bot = new Telegraf(TELEGRAM_BOT_TOKEN);
  bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
}
