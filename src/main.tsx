import Machinat, { makeContainer } from '@machinat/core';
import { AnswerCallbackQuery } from '@machinat/telegram/components';
import { Stream } from '@machinat/stream';
import { filter } from '@machinat/stream/operators';
import Script from '@machinat/script';
import handleChat from './handlers/handleChat';
import handleWebview from './handlers/handleWebview';
import { AppEventContext, ChatEventContext } from './types';

const main = (event$: Stream<AppEventContext>): void => {
  // continue running scripts
  const chat$ = event$.pipe(
    filter((ctx) => ctx.event.platform !== 'webview'),
    filter(
      (ctx) =>
        ctx.event.category === 'message' || ctx.event.category === 'postback'
    ),
    filter(
      makeContainer({ deps: [Script.Processor] })(
        (processor) => async (ctx: ChatEventContext) => {
          if (!ctx.event.channel) {
            return true;
          }
          const runtime = await processor.continue(ctx.event.channel, ctx);
          if (runtime) {
            await ctx.reply(runtime.output());
          }
          return !runtime;
        }
      )
    )
  );

  // handle messages and postbacks from chat platforms
  chat$.subscribe(handleChat).catch(console.error);

  // answer Telegram callback_query
  event$
    .pipe(filter((ctx) => ctx.event.type === 'callback_query'))
    .subscribe(
      (ctx: ChatEventContext & { event: { type: 'callback_query' } }) =>
        ctx.reply(<AnswerCallbackQuery queryId={ctx.event.queryId} />)
    )
    .catch(console.error);

  // handle events from webview
  event$
    .pipe(filter((ctx) => ctx.event.platform === 'webview'))
    .subscribe(handleWebview)
    .catch(console.error);
};

export default main;
