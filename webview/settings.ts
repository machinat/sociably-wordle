import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const MAX_CHALLENGES = Number(publicRuntimeConfig.MAX_CHALLENGES);
export const EPOCH_DATE = new Date(publicRuntimeConfig.EPOCH_DAY);
export const MAX_WORD_LENGTH = 5;
export const ALERT_TIME_MS = 2000;
export const REVEAL_TIME_MS = 350;
export const GAME_LOST_INFO_DELAY = (MAX_WORD_LENGTH + 1) * REVEAL_TIME_MS;
export const WELCOME_INFO_MODAL_MS = 350;
