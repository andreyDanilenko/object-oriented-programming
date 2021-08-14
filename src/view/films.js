import AbstractView from './abstract';

const createFilmListTemplate = () => (
  '<section class="films"></section>'
);

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
