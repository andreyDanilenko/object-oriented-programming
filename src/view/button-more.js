import { createElement } from '../utils/util';

const createButtonMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class LoadMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createButtonMoreTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
