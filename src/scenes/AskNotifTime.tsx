import Sociably, { makeContainer } from '@sociably/core';
import { build } from '@sociably/script';
import * as $ from '@sociably/script/keywords';
import { parseTimeOfDay } from '@diatche/parse-time';
import ConfirmNotify from '../components/ConfirmNotify';
import WithYesNoReplies from '../components/WithYesNoReplies';
import RequestMessenger24HrNotif from '../components/RequestMessenger24HrNotif';
import useIntent from '../services/useIntent';
import { getLocalHour } from '../utils';
import { ChatEventContext } from '../types';

type AskNotifParams = {
  currentNotifHour: undefined | number;
  timezone: number;
  hasMessengerOneTimeToken: boolean;
};
type AskNotifVars = {
  currentNotifHour: undefined | number;
  isBeginning: boolean;
  isOk: boolean;
  notifHour: undefined | number;
  timezone: number;
  hasMessengerOneTimeToken: boolean;
};
type AskNotifReturn = {
  notifHour: undefined | number;
};

const shouldRequestMessengerOneTimeToken = (
  platform: string,
  vars: AskNotifVars
): vars is AskNotifVars & { notifHour: number } =>
  platform === 'messenger' &&
  !vars.hasMessengerOneTimeToken &&
  typeof vars.notifHour === 'number' &&
  vars.notifHour > getLocalHour(vars.timezone, Date.now());

export default build<
  AskNotifVars,
  ChatEventContext,
  AskNotifParams,
  AskNotifReturn
>(
  {
    name: 'AskNotif',
    initVars: ({
      currentNotifHour,
      timezone,
      hasMessengerOneTimeToken = false,
    }) => ({
      currentNotifHour,
      isBeginning: true,
      isOk: true,
      notifHour: undefined,
      timezone,
      hasMessengerOneTimeToken,
    }),
  },
  <$.BLOCK<AskNotifVars>>
    <$.WHILE<AskNotifVars>
      condition={({ vars }) => vars.isOk && typeof vars.notifHour !== 'number'}
    >
      {({ vars: { isBeginning } }) => (
        <WithYesNoReplies noOnly noText="Cancel">
          {isBeginning ? (
            <p>What time do you like to play?</p>
          ) : (
            <p>That's not a valid time</p>
          )}
        </WithYesNoReplies>
      )}

      <$.PROMPT<AskNotifVars, ChatEventContext>
        key="ask-time"
        set={makeContainer({ deps: [useIntent] })(
          (getIntent) =>
            async ({ vars }, { event }) => {
              const timeResult =
                'text' in event && event.text
                  ? parseTimeOfDay(event.text)
                  : undefined;
              const notifHour = timeResult
                ? timeResult.totalMs / 3600000
                : undefined;

              const intent = timeResult ? null : await getIntent(event);

              return {
                ...vars,
                isOk: intent?.type !== 'no',
                notifHour,
                isBeginning: false,
              };
            }
        )}
      />
    </$.WHILE>

    {({ platform, vars }) =>
      shouldRequestMessengerOneTimeToken(platform, vars) ? (
        <RequestMessenger24HrNotif notifHour={vars.notifHour} />
      ) : (
        <ConfirmNotify
          notifHour={vars.isOk ? vars.notifHour : vars.currentNotifHour}
        />
      )
    }

    <$.RETURN<AskNotifVars, AskNotifReturn>
      value={({ platform, vars }) => ({
        notifHour: shouldRequestMessengerOneTimeToken(platform, vars)
          ? undefined
          : vars.notifHour,
      })}
    />
  </$.BLOCK>
);
