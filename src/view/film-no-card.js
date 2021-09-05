import AbstractView from './abstract';
import { FilterType } from '../utils/const';
const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
};

const createFilmNoListTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];
  return `<h2 class="films-list__title">
    ${noFilmsTextValue}
  </h2 > `;
};

export default class FilmNoCard extends AbstractView {
  constructor(data) {
    super();
    this._data = String(data);
  }

  getTemplate() {
    return createFilmNoListTemplate(this._data);
  }
}
