import { Context } from 'telegraf';
import createDebug from 'debug';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const debug = createDebug('bot:greeting_text');

const replyToMessage = (
  ctx: Context,
  messageId: number,
  responseMessage: string,
) =>
  ctx.reply(responseMessage, {
    reply_parameters: { message_id: messageId },
  });

const messageCheck = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  if (!ctx.text) {
    return;
  }

  const response = await openai.responses.create({
    model: 'gpt-4.1-nano',
    instructions: `
      Process the input messages on Ukrainian Language,
      Analyze the cities that are mentioned in the text and calculate the distance to them,
      find and extract the data which related to any objects coming close to the city,
      the city name is Lviv/Львів, Ukraine.
      if anything is going to Lviv, and it is critical and it is not so far,
      answer: YES, otherwise answer: NO
    `,
    input: ctx.text,
    text: {
      format: {
        type: 'text',
      },
    },
    reasoning: {},
    tools: [],
    temperature: 0,
    max_output_tokens: 16,
    top_p: 1,
    store: true,
  });
  previousResponseId = response.id;

  const messageId = ctx.message?.message_id;
  const responseMessage = response.output_text;

  if (messageId && responseMessage) {
    await replyToMessage(ctx, messageId, responseMessage);
  }
};

export { messageCheck };
