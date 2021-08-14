import AbstractView from './abstract';

const createFilmContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
