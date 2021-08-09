export const RATED_COUNT = 8;
export const FILM_COUNT_STEP = 5;
export const MAX_LENGTH_TEXT = 139;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getFirstElement = (arr) => arr[0];
export const getCardClassName = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
export const getPopupClassName = (variable) => variable ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button';
export const getSliceText = (text) => {
  let newText = text.slice(0, MAX_LENGTH_TEXT);
  if (text.length > newText.length) {
    newText += '...';
  }
  return newText;
};

export const createElement = (template) => {
  const newElement = document.createElement('template');
  newElement.innerHTML = template;
  return newElement.content;
};
