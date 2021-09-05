import AbstractView from './abstract';
import { SortType } from '../utils/const';

export const createSiteSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}">Sort by rating</a></li>
  </ul>`
);

export default class Sort extends AbstractView {

  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._getSortTypeChangeHandler = this._getSortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteSortTemplate(this._currentSortType);
  }

  _getSortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    if (document.body.classList.contains('hide-overflow')) {
      document.body.classList.remove('hide-overflow');
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._getSortTypeChangeHandler);
  }
}
