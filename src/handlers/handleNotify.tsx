import Sociably, { makeContainer, BasicBot } from '@sociably/core';
import Messenger from '@sociably/messenger';
import useWordleState from '../services/useWordleState';
import Timer from '../services/Timer';
import WithMenu from '../components/WithMenu';
import { NotifyEventContext } from '../types';

const handleWebview = makeContainer({
  deps: [useWordleState, BasicBot, Messenger.Bot, Timer],
})(
  (updateState, basicBot, messangerBot, timer) =>
    async (ctx: NotifyEventContext) => {
      const channel = ctx.event.channel;
      const { isDayChanged, state } = await updateState(channel, {
        updateDay: true,
      });
      if (!isDayChanged) {
        return;
      }

      const message = <WithMenu>Play today's Wordle!</WithMenu>;

      if (channel.platform === 'messenger') {
        // NOTE: have to register notify everytime because of 24 hour restriction
        await timer.cancelTimer(channel);

        // use one time notification if it's over 24 hour
        if (Date.now() - state.interactAt > 86400000) {
          if (state.messengerOneTimeNotifToken) {
            await messangerBot.render(channel, message, {
              oneTimeNotifToken: state.messengerOneTimeNotifToken,
            });

            await updateState(channel, {}, (currentStats) => ({
              ...currentStats,
              messengerOneTimeNotifToken: undefined,
            }));
          }
          return;
        }
      }

      await basicBot.render(channel, message);
    }
);

export default handleWebview;
