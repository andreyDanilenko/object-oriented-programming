import * as dayjs from 'dayjs';
import { getFirstElement, getCardClassName, getSliceText, createElement } from '../utils/util';

const createFilmCardTemplate = (params) => {
  const { title, runtime, genres, poster, description } = params.filmInfo;
  const rating = params.filmInfo.totalRating;
  const date = dayjs(params.filmInfo.release.date).format('YYYY');
  const comments = params.comments.length;
  const { watchlist, favorite, history } = params.userDetails;

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
      <button class="${getCardClassName(watchlist)} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="${getCardClassName(history)} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="${getCardClassName(favorite)} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class SiteFilmCard {
  constructor(params) {
    this._params = params;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._params);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
