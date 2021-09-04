import AbstractView from './abstract';

const createFilterItemTemplate = (filter) => {
  const { name, count } = filter;

  return (
    `<a href="#watchlist" class="main-navigation__item">${name}
    ${name !== 'All movies' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`
  );
};

const createSiteNavTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Nav extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteNavTemplate(this._filters);
  }
}
