import Sociably, { makeContainer } from '@sociably/core';
import { AnswerCallbackQuery } from '@sociably/telegram/components';
import { Like } from '@sociably/twitter/components';
import { Stream } from '@sociably/stream';
import { filter } from '@sociably/stream/operators';
import Script from '@sociably/script';
import handleChat from './handlers/handleChat';
import handleWebview from './handlers/handleWebview';
import handleNotify from './handlers/handleNotify';
import handleSocialPost from './handlers/handleSocialPost';
import useWordleState from './services/useWordleState';
import Timer from './services/Timer';
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
      makeContainer({ deps: [Script.Processor, useWordleState, Timer] })(
        (processor, updateState, timer) => async (ctx: ChatEventContext) => {
          const { channel } = ctx.event;
          if (!channel) {
            return true;
          }
          const runtime = await processor.continue(channel, ctx);
          if (runtime) {
            await ctx.reply(runtime.output());

            const updatedNotifHour = runtime.returnValue?.notifHour;
            if (typeof updatedNotifHour === 'number') {
              const {
                state: { settings },
              } = await updateState(
                channel,
                { updateInteractTime: true },
                (state) => ({
                  ...state,
                  settings: {
                    ...state.settings,
                    notifHour: updatedNotifHour,
                  },
                })
              );

              await timer.registerTimer(
                channel,
                settings.timezone,
                updatedNotifHour
              );
            }
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

  // handle notify
  event$
    .pipe(filter((ctx) => ctx.event.type === 'notify'))
    .subscribe(handleNotify)
    .catch(console.error);

  // handle notify
  event$
    .pipe(filter((ctx) => ctx.event.type === 'social_post'))
    .subscribe(handleSocialPost)
    .catch(console.error);

  // like tweet when being mentioned
  event$
    .pipe(
      filter(
        (ctx) => ctx.platform === 'twitter' && ctx.event.type === 'mention'
      )
    )
    .subscribe(
      async (ctx: ChatEventContext & { event: { type: 'mention' } }) => {
        await ctx.reply(<Like tweetId={ctx.event.tweet.id} />);
      }
    )
    .catch(console.error);
};

export default main;
