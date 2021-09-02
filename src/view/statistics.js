import AbstractView from './abstract';

export const createStatisticTemplate = (params) => (
  `<p>${params.length} movies inside</p>`
);

export default class Statistic extends AbstractView {
  constructor(params) {
    super();
    this._params = params;
  }

  getTemplate() {
    return createStatisticTemplate(this._params);
  }
}
