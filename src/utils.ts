import { readFileSync } from 'fs';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import { CharStatus, EPOCH_DATE, WORDLIST_DATA_PATH } from './constants';

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word);
};

let wordlist = JSON.parse(readFileSync(WORDLIST_DATA_PATH, 'utf8'));
export const getWordList = () => {
  return wordlist;
};

export const getDayIndex = (timezone: number, time: number) => {
  // January 1, 2022 Game Epoch
  const epochMs = EPOCH_DATE.getTime();
  const msInDay = 86400000;
  const index = Math.floor((time - epochMs + timezone * 3600000) / msInDay);
  return index;
};

export const getWordOfDay = (day: number) => {
  const wordlist = getWordList();
  const word = wordlist[day % wordlist.length].toUpperCase();
  return word;
};

export const getGuessStatuses = (
  guess: string,
  solution: string
): CharStatus[] => {
  const splitSolution = unicodeSplit(solution);
  const splitGuess = unicodeSplit(guess);

  const solutionCharsTaken = splitSolution.map((_) => false);

  const statuses: CharStatus[] = Array.from(Array(guess.length));

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = CharStatus.Correct;
      solutionCharsTaken[i] = true;
      return;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (statuses[i] === CharStatus.Correct) return;

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = CharStatus.Absent;
      return;
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = CharStatus.Present;
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    } else {
      statuses[i] = CharStatus.Absent;
      return;
    }
  });

  return statuses;
};

const format2Digits = (n: number) => (n < 10 ? `0${n}` : n);

export const formatTime = (time: number) => {
  if (time === 0) {
    return '0:00';
  }
  const sec = Math.round(time / 1000) % 60;
  return `${Math.round(time / 60000)}:${format2Digits(sec)}`;
};

export const formatHour = (hour: number) => {
  const hr = Math.floor(hour % 24);
  const min = Math.floor((hour * 60) % 60);
  return `${format2Digits(hr)}:${format2Digits(min)}`;
};

export const getLocalHour = (timezone: number, time: number) =>
  ((time % 86400000) / 3600000 + timezone + 24) % 24;
