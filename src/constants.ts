export const MAX_CHALLENGES = Number(process.env.MAX_CHALLENGES);
export const EPOCH_DATE = new Date(process.env.EPOCH_DAY as string);
export const WORDLIST_DATA_PATH = process.env.WORDLIST_DATA_PATH as string;

export const AGENT_TAG_NAME = process.env.AGENT_TAG_NAME as string;
export const SOCIAL_POST_CHANNEL = { platform: 'app', uid: 'app:social_post' };
export const SOCIAL_POST_UTC_HOUR = Number(process.env.SOCIAL_POST_UTC_HOUR);

export const MESSENGER_PAGE_ID = process.env.MESSENGER_PAGE_ID as string;
export const TELEGRAM_BOT_NAME = process.env.TELEGRAM_BOT_NAME as string;
export const LINE_ACCOUNT_ID = process.env.LINE_ACCOUNT_ID as string;

export enum CharStatus {
  Correct = 1,
  Present = 2,
  Absent = 3,
}
