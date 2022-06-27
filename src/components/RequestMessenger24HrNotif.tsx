import Sociably from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import { formatHour } from '../utils';

type RequestMessenger24HrNotifProps = {
  notifHour: number;
};

const RequestMessenger24HrNotif = (
  { notifHour }: RequestMessenger24HrNotifProps,
  { platform }
) => {
  if (platform === 'messenger') {
    return (
      <Messenger.RequestOneTimeNotif
        title={`New game at ${formatHour(notifHour)}`}
        payload={JSON.stringify({ hour: notifHour })}
      />
    );
  }

  return null;
};

export default RequestMessenger24HrNotif;
