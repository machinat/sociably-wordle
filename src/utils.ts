import { readFileSync } from 'fs';
import { CharStatus } from './constants';
import { default as GraphemeSplitter } from 'grapheme-splitter';

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word);
};

let _wordlist;
export const getWordList = () => {
  if (!_wordlist) {
    _wordlist = JSON.parse(readFileSync('./.wordlist.json', 'utf8'));
  }
  return _wordlist;
};

export const getDayIndex = (time: number) => {
  // January 1, 2022 Game Epoch
  const epochMs = Date.UTC(2022, 0);
  const msInDay = 86400000;
  const index = Math.floor((time - epochMs) / msInDay);
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
