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
    // instructions: `
    //   Process the input messages on Ukrainian Language,
    //   Analyze the cities that are mentioned in the text and calculate the distance to them,
    //   find and extract the data which related to any objects coming close to the city,
    //   the city name is Lviv/Львів, Ukraine.
    //   The city name can be not included in the text, in this case the message is about Lviv.
    //   if anything is going to Lviv, and it is critical and it is not so far,
    //   answer: YES, otherwise answer: NO
    // `,
    instructions: `
      Проаналізуйте вхідні повідомлення українською мовою,
      Ці повідомлення з Львівсткої групи, яка знаходиться в Україні.

      Візьми до уваги міста, згадані в тексті, та обчисліть відстань від них до Львова.

      Назва міста - Львів, Україна.

      Якщо в тексті немає згадки про назву міста значить там йдеться про Львів.
      Якщо пишуть що на підльоті чи ще щось в тому роді, значить обєкт вже близько і це небезпечно
      Коли пишуть про вибухи сусідніх містах або областях, це теж критично важливо, але тільки якщо це прилягаючі міста або області.

      Якщо якийсь обєкт наближається, і це критично важливо, та він неминуче близько -
      відповідай: YES, в іншому випадку відповідайте: NO.
      
      Відповідай тільки одним словом YES або NO.
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

  const messageId = ctx.message?.message_id;
  const responseMessage = response.output_text;

  if (messageId && responseMessage) {
    await replyToMessage(ctx, messageId, responseMessage);
  }
};

export { messageCheck };
