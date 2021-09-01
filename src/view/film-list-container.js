import AbstractView from '../abstract/component';

const createFilmListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmsListContainer extends AbstractView {
  getTemplate() {
    return createFilmListContainerTemplate();
  }
}
