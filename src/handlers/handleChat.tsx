import Machinat, { makeContainer } from '@machinat/core';
import About from '../scenes/About';
import AskNotifTime from '../scenes/AskNotifTime';
import WithMenu from '../components/WithMenu';
import Statistics from '../components/Statistics';
import ShareGameText from '../components/ShareGameText';
import ConfirmNotify from '../components/ConfirmNotify';
import useIntent from '../services/useIntent';
import useUserProfile from '../services/useUserProfile';
import useWordleState from '../services/useWordleState';
import Timer from '../services/Timer';
import { getWordOfDay, getDayIndex } from '../utils';
import { ChatEventContext } from '../types';

const handleChat = makeContainer({
  deps: [useIntent, useUserProfile, useWordleState, Timer],
})(
  (getIntent, getUserProfile, getWordleState, timer) =>
    async (
      ctx: ChatEventContext & { event: { category: 'message' | 'postback' } }
    ) => {
      const { event, reply } = ctx;
      if (!event.channel) {
        return;
      }
      const intent = await getIntent(event);
      const {
        state: { game, stats, settings },
      } = await getWordleState(event.channel, true);
      const day = getDayIndex(settings.timezone, Date.now());
      const isFinishedToday = !!game.end;

      if (intent.type === 'about') {
        return reply(<About.Start />);
      }

      if (intent.type === 'share' && isFinishedToday) {
        return reply(
          <>
            <p>Game record today 👇</p>
            <ShareGameText
              day={day}
              answer={getWordOfDay(day)}
              guesses={game.guesses}
              finishTime={game.end && game.start && game.end - game.start}
            />
          </>
        );
      }

      if (intent.type === 'stats') {
        return reply(<Statistics gameStats={stats} />);
      }

      if (intent.type === 'notify') {
        if (typeof settings.notifHour !== 'number') {
          return reply(<AskNotifTime.Start />);
        }

        await timer.registerTimer(
          event.channel,
          settings.timezone,
          settings.notifHour
        );
        return reply(<ConfirmNotify notifHour={settings.notifHour} />);
      }

      if (intent.type === 'cancel_notify') {
        if (typeof settings.notifHour === 'number') {
          await timer.cancelTimer(event.channel);
        }

        return reply(<ConfirmNotify notifHour={undefined} />);
      }

      if (intent.type === 'update_notify_time') {
        return reply(
          <AskNotifTime.Start
            params={{ currentNotifHour: settings.notifHour }}
          />
        );
      }

      const profile = await getUserProfile(event.user);
      const greeting =
        intent.type === 'greeting'
          ? `Hello${profile ? `, ${profile.name}` : ''}! `
          : '';
      return reply(
        isFinishedToday ? (
          <WithMenu isGameFinished withShareButton>
            {greeting}You've finished today's game!
          </WithMenu>
        ) : (
          <WithMenu>{greeting}Play today's Wordle!</WithMenu>
        )
      );
    }
);

export default handleChat;
