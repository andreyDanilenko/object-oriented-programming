import { generateComment } from './data-comments';
import * as dayjs from 'dayjs';
import { getRandomInt } from '../utils/util';

const generatePoster = () => ({
  0: 'made-for-each-other.png',
  1: 'popeye-meets-sinbad.png',
  2: 'sagebrush-trail.jpg',
  3: 'santa-claus-conquers-the-martians.jpg',
  4: 'the-dance-of-life.jpg',
  5: 'the-great-flamarion.jpg',
  6: 'the-man-with-the-golden-arm.jpg',
}[getRandomInt(0, 6)]);

const generateAgeRating = () => ({
  0: '3+',
  1: '12+',
  2: '18+',
}[getRandomInt(0, 2)]);

const generateGenres = () => ({
  0: ['Drama', 'Thriller', 'Horrors'],
  1: ['Western', 'Horrors', 'Mystery'],
  2: ['Drama'],
  3: ['Detective', 'Film-Noir', 'Mystery'],
  4: ['Comedy'],
}[getRandomInt(0, 4)]);

const generateWriters = () => ({
  0: ['Erich Stroheim', 'Mary Hughes', 'Judy Garland'],
  1: ['Marlon Brando', 'Gary Cooper', 'Dan Duryea'],
  2: ['Marilyn Monroe', 'James Stewart', 'Judy Garland'],
  3: ['Erich Stroheim', 'Henry Fonda', 'Dan Duryea'],
  4: ['William Gable', 'Charles Chaplin', 'Dan Duryea'],
}[getRandomInt(0, 4)]);

const generateActors = () => ({
  0: ['Erich von Stroheim', 'Mary Beth Hughes', 'Judy Garland'],
  1: ['Marlon Brando', 'Gary Cooper', 'Dan Duryea'],
  2: ['Marilyn Monroe', 'James Maitland Stewart', 'Judy Garland'],
  3: ['Erich von Stroheim', 'Henry Jaynes Fonda', 'Dan Duryea'],
  4: ['William Clark Gable', 'Charles Spencer Chaplin', 'Dan Duryea'],
}[getRandomInt(0, 4)]);

const generateTitle = () => ({
  0: 'The Dance of Life',
  1: 'Sagebrush Trail',
  2: 'The Man with the Golden Arm',
  3: 'Santa Claus Conquers the Martians',
  4: 'Popeye the Sailor Meets Sindbad the Sailor',
}[getRandomInt(0, 4)]);

const generateDirector = () => ({
  0: 'Christopher Nolan',
  1: 'Guy Ritchie',
  2: 'Clinton Eastwood',
  3: 'Quentin Tarantino',
  4: 'Wesley Anderson',
}[getRandomInt(0, 4)]);

const generateCountry = () => ({
  0: 'Russia',
  1: 'USA',
  2: 'Great Britain',
  3: 'Spain',
  4: 'Italy',
}[getRandomInt(0, 4)]);

const generateDescription = () => ({
  0: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed senectus aliquet mollis, eleifend pellentesque ligula euismod justo blandit class at purus. Molestie placerat elementum mi porta dolor imperdiet non per consectetur, hendrerit egestas quam nullam eros class diam lobortis. Nullam morbi sem massa sociosqu sapien vel dictum, ex fermentum congue torquent ipsum volutpat, nibh mattis feugiat suscipit ridiculus penatibus.',
  1: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, maximus dui magnis ac etiam justo. Dictumst suspendisse arcu ut praesent dapibus ligula inceptos diam magna accumsan leo sociosqu rhoncus pretium luctus, platea nec justo mauris volutpat est id lacus sit porta congue malesuada vehicula. Integer rhoncus suscipit nostra dignissim hendrerit odio porta interdum quam, a habitant enim eu ligula natoque tristique felis maximus, etiam euismod nulla tortor vestibulum urna in id.',
  2: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, fringilla non posuere ullamcorper porta odio faucibus, euismod blandit pretium auctor aliquet a. Egestas dapibus ridiculus ullamcorper dignissim neque porttitor inceptos tellus risus enim consectetur litora at lacinia cubilia ante, facilisi rhoncus molestie sit fringilla pellentesque suspendisse faucibus mollis adipiscing lectus phasellus mauris etiam massa. Adipiscing platea proin ligula non laoreet scelerisque blandit enim quam, magna amet suscipit eget condimentum volutpat lacinia.',
  3: 'Lorem ipsum dolor sit amet consectetur adipiscing elit erat penatibus, tortor facilisi sapien mattis feugiat aenean neque lacinia torquent, dictumst fermentum ac euismod imperdiet proin ornare nostra. Ipsum ac vel arcu sociosqu curabitur sodales metus nam, mollis commodo imperdiet tincidunt natoque tellus consequat velit, hendrerit fringilla elementum duis convallis fames id. Sapien luctus quam convallis quisque donec primis amet, congue praesent platea mauris fames aptent posuere, metus non vehicula tristique semper sodales.',
  4: 'Lorem ipsum dolor sit amet consectetur adipiscing elit aptent est, ultricies hendrerit rhoncus nunc pulvinar diam euismod eu cubilia suscipit, eget habitant nullam torquent vitae hac varius congue. Praesent litora congue donec pulvinar varius consequat nulla dignissim, proin nascetur nibh id sed porttitor et, pretium faucibus curae semper vel lobortis viverra. Fames leo quam turpis bibendum sodales blandit varius magna, justo laoreet venenatis nulla vivamus placerat rutrum adipiscing, odio arcu senectus pharetra cubilia feugiat conubia.',
}[getRandomInt(0, 4)]);

function createId() {
  const random = Math.random();
  return random.toString(16).substr(2);
}

const generateReleaseDate = () => {
  const dayGap = getRandomInt(-35040, -16790);
  return dayjs().add(dayGap, 'day').toDate();
};

const generateWatchList = () => {
  const dayGap = getRandomInt(-1095, 0);
  return dayjs().add(dayGap, 'day').toDate();
};

const generateObject = () => (
  {
    'id': createId(),
    'comments': new Array(getRandomInt(10, 40)).fill().map(() => generateComment()),
    'filmInfo': {
      'title': generateTitle(),
      'alternativeTitle': generateTitle(),
      'totalRating': getRandomInt(4, 9).toFixed(1),
      'poster': generatePoster(),
      'ageRating': generateAgeRating(),
      'director': generateDirector(),
      'writers': generateWriters(),
      'actors': generateActors(),
      'release': {
        'date': generateReleaseDate(),
        'releaseCountry': generateCountry(),
      },
      'runtime': `1h ${getRandomInt(10, 50)}m`,
      'genres': generateGenres(),
      'description': generateDescription(),
    },
    'userDetails': {
      'watchlist': Boolean(getRandomInt(0, 1)),
      'history': Boolean(getRandomInt(0, 1)),
      'watchingDate': generateWatchList(),
      'favorite': Boolean(getRandomInt(0, 1)),
    },
  });

const CARD_COUNT = 23;
export const cardData = new Array(CARD_COUNT).fill().map(() => generateObject());
