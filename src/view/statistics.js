import { createElement } from '../utils/util';

export const createStatisticTemplate = (params) => (
  `<p>${params.length} movies inside</p>`
);

export default class Statistic {
  constructor(params) {
    this._params = params;
    this._element = null;
  }

  getTemplate() {
    return createStatisticTemplate(this._params);
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
