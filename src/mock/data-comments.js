import { getRandomInt } from './data-card';

const generateText = () => ({
  0: 'The Dance of Life',
  1: 'Sagebrush Trail',
  2: 'The Man with the Golden Arm',
  3: 'Santa Claus Conquers the Martians',
  4: 'Interesting setting and a good cast',
  5: 'Connie (Mary Beth Hughes)',
  6: 'Flamarion falls in love with Connie',
  7: 'The Great Flamarion (Erich von Stroheim) ',
  8: 'Santa Claus Conquers the Martians',
  9: 'Very very old. Meh',
}[getRandomInt(0, 9)]);


const generateName = () => ({
  0: 'John Doe',
  1: 'Marilyn Monroe',
  2: 'Tim Macoveev',
  3: 'Dan Duryea',
  4: 'John Doe',
  5: 'Gary Cooper',
  6: 'Gary Cooper',
  7: 'Dan Duryea',
  8: 'Santa Claus',
  9: 'Meets Sindbad',
}[getRandomInt(0, 9)]);

const generateEmoji = () => ({
  0: 'angry.png',
  1: 'puke.png',
  2: 'sleeping.png',
  3: 'smile.png',
}[getRandomInt(0, 3)]);

const formatDate = (param) => {
  let dd = param.getDate();
  if (dd < 10) { dd = `0${dd}`; }

  let mm = param.getMonth() + 1;
  if (mm < 10) { mm = `0${mm}`; }

  let yy = param.getFullYear() % 100;
  if (yy < 10) { yy = `0${yy}`; }

  let hh = param.getHours() % 100;
  if (hh < 10) { hh = `0${hh}`; }

  let mt = param.getMinutes() % 100;
  if (mt < 10) { mt = `0${mt}`; }

  return `${dd}/${mm}/${yy} ${hh}:${mt}`;
};

const dateCom = new Date(2018, 5, 24);
const newDate = formatDate(dateCom);

export const generateComment = () => ({
  text: generateText(),
  authorName: generateName(),
  emoji: generateEmoji(),
  date: newDate,
});
