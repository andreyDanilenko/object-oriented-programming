import { createElement } from '../utils/util';

const createFilmNoListTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class FilmNoCard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmNoListTemplate();
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
