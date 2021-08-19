import AbstractView from './abstract';

const createFilmListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
