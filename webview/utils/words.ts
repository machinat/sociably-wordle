import { CharStatus } from '../../src/constants';
import VALID_GUESSES from '../../validGuesses.json';
import WORDS from '../../wordlist.json';
import { WRONG_SPOT_MESSAGE, NOT_CONTAINED_MESSAGE } from '../strings';
import { default as GraphemeSplitter } from 'grapheme-splitter';
export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  );
};

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (
  word: string,
  lastGuess: string,
  statuses: CharStatus[]
) => {
  const lettersLeftArray = new Array<string>();
  const splitWord = unicodeSplit(word);
  const splitGuess = unicodeSplit(lastGuess);

  for (let i = 0; i < splitGuess.length; i++) {
    if (
      statuses[i] === CharStatus.Correct ||
      statuses[i] === CharStatus.Present
    ) {
      lettersLeftArray.push(splitGuess[i]);
    }
    if (statuses[i] === CharStatus.Correct && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1);
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n;
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter);
    if (n !== -1) {
      lettersLeftArray.splice(n, 1);
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0]);
  }
  return false;
};

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word);
};

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length;
};

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase();
};

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase();
};

export const getKeyboradStatuses = (
  guesses: string[],
  results: CharStatus[][]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {};

  guesses.forEach((word, guessIdx) => {
    unicodeSplit(word).forEach((letter, letterIdx) => {
      const letterStatus = results[guessIdx][letterIdx];

      if (charObj[letter] !== CharStatus.Correct) {
        charObj[letter] = letterStatus;
      }
    });
  });

  return charObj;
};
