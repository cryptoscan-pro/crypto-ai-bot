import { Telegraf } from 'telegraf';
import { fetch } from 'bun';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('message', async (ctx) => {
  const prompt = ctx.message.text;
  const response = await fetch('https://api.cryptoscan.pro/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  const result = data.result;

  await ctx.reply(result);
});

bot.launch();
