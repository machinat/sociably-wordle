import Machinat, { makeContainer, BasicBot } from '@machinat/core';
import useWordleState from '../services/useWordleState';
import Timer from '../services/Timer';
import WithMenu from '../components/WithMenu';
import { NotifyEventContext } from '../types';

const handleWebview = makeContainer({
  deps: [useWordleState, BasicBot, Timer],
})((updateState, basicBot, timer) => async (ctx: NotifyEventContext) => {
  const channel = ctx.event.channel;
  const { isDayChanged } = await updateState(channel, true);

  if (isDayChanged) {
    if (channel.platform === 'messenger') {
      // NOTE: have to register notify everytime because of 24 hour restriction
      await timer.cancelTimer(channel);
    }

    await basicBot.render(channel, <WithMenu>Play today's Wordle!</WithMenu>);
  }
});

export default handleWebview;
