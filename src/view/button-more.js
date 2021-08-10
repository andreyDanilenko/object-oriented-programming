import AbstractView from './abstract';

const createButtonMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class LoadMoreButton extends AbstractView {
  getTemplate() {
    return createButtonMoreTemplate();
  }
}
