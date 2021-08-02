export const createFilmCardTemplate = (param) => {
  String.prototype.trimEllip = function (length) {
    return this.length > length ? `${this.substring(0, length)}...` : this;
  };

  const stringArr = (arr) => arr[0];

  const { title, runtime, genre, poster, description } = param.film_info;
  const rating = param.film_info.total_rating;
  const date = param.film_info.release.date;
  const comments = param.comments.length;
  const { watchlist, favorite } = param.user_details;
  const history = param.user_details.already_watched;
  const className = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${stringArr(genre)}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.trimEllip(139)}</p>
    <a class="film-card__comments">${comments} comments</a>
    <div class="film-card__controls">
      <button class="${className(watchlist)} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="${className(history)} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="${className(favorite)} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
