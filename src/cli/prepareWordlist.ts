import { writeFileSync, readFileSync } from 'fs';

const wordlist = JSON.parse(readFileSync('./wordlist.json', 'utf8'));

const listWithRandomOrder: string[] = [];
const restWordList = [...wordlist];

while (restWordList.length > 0) {
  const idx = Math.floor(Math.random() * restWordList.length);
  const [word] = restWordList.splice(idx, 1);
  listWithRandomOrder.push(word);
}

writeFileSync('./.wordlist.json', JSON.stringify(listWithRandomOrder));
