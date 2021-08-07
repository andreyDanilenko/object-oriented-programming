import { createElement } from '../utils/util';

export const createFilmListExtraTemplate = (params) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${params.title}</h2>
      <div class="films-list__container"></div>
    </section>`
);

export default class SiteFilmsListExtra {
  constructor(params) {
    this._params = params;
    this._element = null;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._params);
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
