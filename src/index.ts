import { Telegraf } from 'telegraf';

import { about } from './commands';
import { messageCheck } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.command('about', about());
bot.on('message', messageCheck());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

//dev mode
ENVIRONMENT !== 'production' && development(bot);
