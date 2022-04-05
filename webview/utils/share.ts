import { GAME_TITLE } from '../strings';
import { MAX_CHALLENGES, CharStatus } from '../../src/constants';
import { UAParser } from 'ua-parser-js';

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable'];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

export const shareStatus = (
  day: number,
  results: CharStatus[][],
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void
) => {
  const textToShare =
    `${GAME_TITLE} ${day} ${lost ? 'X' : results.length}/${MAX_CHALLENGES}${
      isHardMode ? '*' : ''
    }\n\n` +
    generateEmojiGrid(results, getEmojiTiles(isDarkMode, isHighContrastMode));

  const shareData = { text: textToShare };

  let shareSuccess = false;

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare);
    handleShareToClipboard();
  }
};

export const generateEmojiGrid = (results: CharStatus[][], tiles: string[]) => {
  return results
    .map((statuses) => {
      return statuses
        .map((status) => {
          switch (status) {
            case CharStatus.Correct:
              return tiles[0];
            case CharStatus.Present:
              return tiles[1];
            default:
              return tiles[2];
          }
        })
        .join('');
    })
    .join('\n');
};

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  );
};

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = [];
  tiles.push(isHighContrastMode ? '🟧' : '🟩');
  tiles.push(isHighContrastMode ? '🟦' : '🟨');
  tiles.push(isDarkMode ? '⬛' : '⬜');
  return tiles;
};
