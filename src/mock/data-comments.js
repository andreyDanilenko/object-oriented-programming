import { getRandomInt } from '../utils/util';
import * as dayjs from 'dayjs';

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

const generateCommentDate = () => {
  const dayGap = getRandomInt(-20000, 0);
  return dayjs().add(dayGap, 'minutes').toDate();
};

function createId() {
  const random = Math.random();
  return random.toString(16).substr(2);
}

export const generateComment = () => ({
  id: createId(),
  text: generateText(),
  authorName: generateName(),
  emoji: generateEmoji(),
  date: generateCommentDate(),
});
