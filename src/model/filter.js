import AbstractObserver from '../utils/abstract-observer.js';
import { FilterType } from '../utils/const.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._notify(filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
