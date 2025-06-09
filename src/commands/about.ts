import { Context } from 'telegraf';
import createDebug from 'debug';

import { author, name, version } from '../../package.json';

const debug = createDebug('bot:about_command');

const about = () => async (ctx: Context) => {
  const message = `*${name} ${version}*\n${author}`;
  debug(`Triggered "about" command with message \n${message}`);
  const details = JSON.stringify(
    await ctx.telegram.getWebhookInfo(),
    undefined,
    2,
  );
  const detailsMD = '```' + details + '```';
  await ctx.replyWithMarkdownV2(message + '\n\n' + detailsMD, {
    parse_mode: 'Markdown',
  });
};

export { about };
