import Machinat, { makeContainer } from '@machinat/core';
import { build } from '@machinat/script';
import * as $ from '@machinat/script/keywords';
import ConfirmNotify from '../components/ConfirmNotify';
import WithYesNoReplies from '../components/WithYesNoReplies';
import RequestMessenger24HrNotif from '../components/RequestMessenger24HrNotif';
import useIntent from '../services/useIntent';
import { getLocalHour } from '../utils';
import { AppEventContext } from '../types';

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
  AppEventContext,
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
            <p>
              What time do you like to play?
              <br />
              (gimme a 0-24 number)
            </p>
          ) : (
            <p>please give me a 0-24 number</p>
          )}
        </WithYesNoReplies>
      )}

      <$.PROMPT<AskNotifVars>
        key="ask-time"
        set={makeContainer({ deps: [useIntent] })(
          (getIntent) =>
            async ({ vars }, { event }) => {
              const hr = Number(event.text);
              if (Number.isNaN(hr)) {
                const intent = await getIntent(event);
                return {
                  ...vars,
                  isOk: intent.type !== 'no',
                  isBeginning: false,
                };
              }

              if (hr < 0 || hr > 24) {
                return { ...vars, isBeginning: false };
              }

              return {
                ...vars,
                notifHour: hr === 24 ? 0 : hr,
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
