import AbstractView from '../abstract/component';

const createFilmNoListTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class FilmNoCard extends AbstractView {
  getTemplate() {
    return createFilmNoListTemplate();
  }
}
