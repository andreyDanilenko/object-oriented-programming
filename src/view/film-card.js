export const createFilmCardTemplate = (param) => {
  String.prototype.trimEllip = function (length) {
    return this.length > length ? `${this.substring(0, length)}...` : this;
  };

  const stringArr = (arr) => arr[0];

  return `<article class="film-card">
    <h3 class="film-card__title">${param.film_info.title}</h3>
    <p class="film-card__rating">${param.film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${param.film_info.release.date}</span>
      <span class="film-card__duration">${param.film_info.runtime}</span>
      <span class="film-card__genre">${stringArr(param.film_info.genre)}</span>
    </p>
    <img src="./images/posters/${param.film_info.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${param.film_info.description.trimEllip(139)}</p>
    <a class="film-card__comments">${param.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
