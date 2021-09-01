import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
  }

  setFilms(cards) {
    this._cards = cards.slice();
  }

  getFilms() {
    return this._cards;
  }
}
