import AbstractView from '../abstract/component';
import { SortType } from '../utils/const';

export const createSiteSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class Sort extends AbstractView {

  constructor() {
    super();

    this._getSortTypeChangeHandler = this._getSortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteSortTemplate();
  }

  _getClassActive(link) {
    const sortButtons = this.getElement().querySelectorAll('.sort__button');
    sortButtons.forEach(((btn) => {
      btn.classList.remove('sort__button--active');
    }));
    link.classList.add('sort__button--active');
  }

  _getSortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    if (document.body.classList.contains('hide-overflow')) {
      document.body.classList.remove('hide-overflow');
    }
    evt.preventDefault();
    this._getClassActive(evt.target);
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._getSortTypeChangeHandler);
  }
}
