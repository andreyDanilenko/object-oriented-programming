export const createFilmCardTemplate = (params) => {
  const getFirstArr = (arr) => arr[0];

  const { title, runtime, genre, poster, description } = params.film_info;
  const rating = params.film_info.total_rating;
  const date = params.film_info.release.date;
  const comments = params.comments.length;
  const { watchlist, favorite } = params.user_details;
  const history = params.user_details.already_watched;
  const className = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';

  const getSliceText = (text) => {
    let newText = text.slice(0, 139);
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
      <span class="film-card__genre">${getFirstArr(genre)}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${getSliceText(description)}</p>
    <a class="film-card__comments">${comments} comments</a>
    <div class="film-card__controls">
      <button class="${className(watchlist)} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="${className(history)} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="${className(favorite)} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
