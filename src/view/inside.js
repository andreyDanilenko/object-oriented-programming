import AbstractView from './abstract';

export const createMoviesInsideTemplate = (params) => (
  `<p>${params.length} movies inside</p>`
);

export default class MoviesInside extends AbstractView {
  constructor(params) {
    super();
    this._params = params;
  }

  getTemplate() {
    return createMoviesInsideTemplate(this._params);
  }
}
