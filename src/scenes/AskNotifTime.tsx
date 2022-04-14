import Machinat, { makeContainer } from '@machinat/core';
import { build } from '@machinat/script';
import * as $ from '@machinat/script/keywords';
import ConfirmNotify from '../components/ConfirmNotify';
import WithYesNoReplies from '../components/WithYesNoReplies';
import useIntent from '../services/useIntent';
import { AppEventContext } from '../types';

type AskNotifParams = {
  currentNotifHour: undefined | number;
};
type AskNotifVars = {
  currentNotifHour: undefined | number;
  isBeginning: boolean;
  isOk: boolean;
  notifHour: undefined | number;
};
type AskNotifReturn = {
  notifHour: undefined | number;
};

export default build<
  AskNotifVars,
  AppEventContext,
  AskNotifParams,
  AskNotifReturn
>(
  {
    name: 'AskNotif',
    initVars: ({ currentNotifHour }) => ({
      currentNotifHour,
      isBeginning: true,
      isOk: true,
      notifHour: undefined,
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

    {({ vars }) => (
      <ConfirmNotify
        notifHour={vars.isOk ? vars.notifHour : vars.currentNotifHour}
      />
    )}

    <$.RETURN<AskNotifVars, AskNotifReturn>
      value={({ vars }) => ({ notifHour: vars.notifHour })}
    />
  </$.BLOCK>
);
