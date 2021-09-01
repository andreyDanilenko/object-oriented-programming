import AbstractView from '../abstract/component';

const createFilmListTemplate = () => (
  '<section class="films"></section>'
);

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
