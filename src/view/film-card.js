import * as dayjs from 'dayjs';

export const createFilmCardTemplate = (params) => {
  const MAX_LENGTH_TEXT = 139;

  const getFirstElement = (arr) => arr[0];
  const { title, runtime, genres, poster, description } = params.filmInfo;
  const rating = params.filmInfo.totalRating;
  const date = dayjs(params.filmInfo.release.date).format('YYYY');
  const comments = params.comments.length;
  const { watchlist, favorite, history } = params.userDetails;
  const getClassName = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
  const getSliceText = (text) => {
    let newText = text.slice(0, MAX_LENGTH_TEXT);
    if (text.length > newText.length) {
      newText += '...';
    }
    return newText;
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${getFirstElement(genres)}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${getSliceText(description)}</p>
    <a class="film-card__comments">${comments} comments</a>
    <div class="film-card__controls">
      <button class="${getClassName(watchlist)} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="${getClassName(history)} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="${getClassName(favorite)} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
