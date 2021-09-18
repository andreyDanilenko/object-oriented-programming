import AbstractView from './abstract';

const createButtonMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHundler = this._getClickHandler.bind(this);

  }

  getTemplate() {
    return createButtonMoreTemplate();
  }

  _getClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHundler);
  }
}
