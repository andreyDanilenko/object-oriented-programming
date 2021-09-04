import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(update);
  }

  // addTask(updateType, update) {
  //   this._tasks = [
  //     update,
  //     ...this._tasks,
  //   ];

  //   this._notify(updateType, update);
  // }

  // deleteComment(update) {
  //   const index = this._films.findIndex((film) => film.id === update.id);

  //   // this._films = [
  //   //   ...this._films.slice(0, index),
  //   //   ...this._films.slice(index + 1),
  //   // ];


  //   if (index === -1) {
  //     throw new Error('Can\'t update unexisting film');
  //   }

  //   this._films = [
  //     ...this._films.slice(0, index),
  //     update,
  //     ...this._films.slice(index + 1),
  //   ];

  //   this._notify(update);
  // }
}
