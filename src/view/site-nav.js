import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterTyp = 'all') => {
  const { name, count, type } = filter;
  return (
    `<a href="#watchlist" data-filter="${type}"  class="main-navigation__item ${type === currentFilterTyp ? 'main-navigation__item--active' : ''}">${name}
    ${name !== 'All movies' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`
  );
};

const createSiteNavTemplate = (filterItems, currentFilterTyp) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterTyp))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Nav extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteNavTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
