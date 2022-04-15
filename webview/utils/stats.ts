import { EPOCH_DATE } from '../settings';

export const getDayBegin = (day: number) => {
  const utcTomorrow = new Date(EPOCH_DATE).setUTCDate(
    EPOCH_DATE.getUTCDate() + day
  );
  return new Date(utcTomorrow + new Date().getTimezoneOffset() * 60000);
};
