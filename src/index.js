import 'dotenv/config';
import telegramify from 'telegramify-markdown';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('message', async (ctx) => {
	try {
		const prompt = ctx.message.text;
		const query = new URLSearchParams({
			prompt,
		});
		const url = 'https://api.cryptoscan.pro/ai?' + query
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: process.env.CRYPTOSCAN_API_KEY || undefined,
			},
		});

		if (!response.ok) {
			return ctx.reply('Something went wrong');
		}

		const data = await response.json();
		const result = data.data.result;
		const text = result.split('\n').map((line) => line.replace(/^\* /g, '- ')).join('\n')

		await ctx.reply(telegramify(text), {
      parse_mode: 'MarkdownV2',
		});
	} catch (error) {
		console.error(error);
		ctx.reply('Something went wrong: ' + error.message);
	}
});

bot.launch();
