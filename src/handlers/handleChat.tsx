import Sociably, { makeContainer } from '@sociably/core';
import About from '../scenes/About';
import AskNotifTime from '../scenes/AskNotifTime';
import WithMenu from '../components/WithMenu';
import Statistics from '../components/Statistics';
import ShareGameText from '../components/ShareGameText';
import ConfirmNotify from '../components/ConfirmNotify';
import RequestMessenger24HrNotif from '../components/RequestMessenger24HrNotif';
import useIntent from '../services/useIntent';
import useUserProfile from '../services/useUserProfile';
import useWordleState from '../services/useWordleState';
import Timer from '../services/Timer';
import { getWordOfDay, getDayIndex, getLocalHour } from '../utils';
import { MAX_CHALLENGES } from '../constants';
import { ChatEventContext } from '../types';

const handleChat = makeContainer({
  deps: [useIntent, useUserProfile, useWordleState, Timer],
})(
  (getIntent, getUserProfile, updateWordleState, timer) =>
    async (
      ctx: ChatEventContext & { event: { category: 'message' | 'postback' } }
    ) => {
      const { event, reply } = ctx;
      if (!event.channel) {
        return;
      }

      const intent = await getIntent(event);
      const {
        state: {
          game,
          stats,
          settings: { notifHour, timezone },
          messengerOneTimeNotifToken,
        },
      } = await updateWordleState(event.channel, {
        updateDay: true,
        updateInteractTime: true,
      });
      const day = getDayIndex(timezone, Date.now());
      const isFinishedToday =
        !!game.end || game.guesses.length >= MAX_CHALLENGES;

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

      if (intent.type === 'notify' && isFinishedToday) {
        if (typeof notifHour !== 'number') {
          return reply(
            <AskNotifTime.Start
              params={{
                currentNotifHour: undefined,
                timezone,
                hasMessengerOneTimeToken: !!messengerOneTimeNotifToken,
              }}
            />
          );
        }
        if (
          event.platform === 'messenger' &&
          !messengerOneTimeNotifToken &&
          notifHour > getLocalHour(timezone, Date.now())
        ) {
          return reply(<RequestMessenger24HrNotif notifHour={notifHour} />);
        }

        await timer.registerTimer(event.channel, timezone, notifHour);
        return reply(<ConfirmNotify notifHour={notifHour} />);
      }

      if (intent.type === 'cancel_notify') {
        if (typeof notifHour === 'number') {
          await timer.cancelTimer(event.channel);
        }

        return reply(<ConfirmNotify notifHour={undefined} />);
      }

      if (intent.type === 'update_notify_time') {
        return reply(
          <AskNotifTime.Start
            params={{
              currentNotifHour: notifHour,
              timezone,
              hasMessengerOneTimeToken: !!messengerOneTimeNotifToken,
            }}
          />
        );
      }

      if (event.type === 'one_time_notif_optin') {
        const { hour } = JSON.parse(event.data);

        const {
          state: { settings },
        } = await updateWordleState(
          event.channel,
          { updateInteractTime: true },
          (currentState) => ({
            ...currentState,
            settings: {
              ...currentState.settings,
              notifHour: hour,
            },
            messengerOneTimeNotifToken: event.token,
          })
        );
        await timer.registerTimer(event.channel, settings.timezone, hour);

        return reply(<ConfirmNotify notifHour={hour} />);
      }

      const profile = await getUserProfile(event.user);
      const greeting =
        intent.type === 'greeting'
          ? `Hello${profile ? `, ${profile.name}` : ''}! `
          : '';
      return reply(
        isFinishedToday ? (
          <WithMenu isGameFinished withStatsButton withShareButton>
            {greeting}You've finished today's game!
          </WithMenu>
        ) : (
          <WithMenu>{greeting}Play today's Wordle!</WithMenu>
        )
      );
    }
);

export default handleChat;
