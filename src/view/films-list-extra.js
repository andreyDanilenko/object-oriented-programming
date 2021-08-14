import AbstractView from './abstract';

export const createFilmListExtraTemplate = (params) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${params.title}</h2>
    </section>`
);

export default class FilmsListExtra extends AbstractView {
  constructor(params) {
    super();
    this._params = params;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._params);
  }
}
