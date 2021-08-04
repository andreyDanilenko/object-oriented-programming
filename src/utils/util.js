export const RATED_COUNT = 8;
export const FILM_COUNT_STEP = 5;
export const FILM_COUNT_EXTRA = 4;
export const MAX_LENGTH_TEXT = 139;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getFirstElement = (arr) => arr[0];
export const getClassName = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
export const getSliceText = (text) => {
  let newText = text.slice(0, MAX_LENGTH_TEXT);
  if (text.length > newText.length) {
    newText += '...';
  }
  return newText;
};
