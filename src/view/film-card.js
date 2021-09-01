import * as dayjs from 'dayjs';
import { getFirstElement, getCardClassName, getSliceText } from '../utils/util';
import AbstractView from '../abstract/component';

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

export default class FilmCard extends AbstractView {
  constructor(params) {
    super();
    this._params = params;
    this._filmCard = this.getElement();

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._getOpenClickHandler = this._getOpenClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._params);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
    console.log(this._callback.watchlistClick);
  }

  _getOpenClickHandler(evt) {
    evt.preventDefault();
    this._callback.openPopupFilm();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this._filmCard.querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this._filmCard.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._historyClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this._filmCard.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setOpenClickHandler(callback) {
    this._callback.openPopupFilm = callback;
    this._filmCard.querySelector('.film-card__poster').addEventListener('click', this._getOpenClickHandler);
    this._filmCard.querySelector('.film-card__comments').addEventListener('click', this._getOpenClickHandler);
    this._filmCard.querySelector('.film-card__title').addEventListener('click', this._getOpenClickHandler);
  }
}
