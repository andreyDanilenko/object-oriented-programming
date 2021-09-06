import NavView from '../view/site-nav';
import { RenderPosition, render, replace, remove } from '../utils/render';
import { filter } from '../utils/filters';
import { FilterType, UpdateType } from '../utils/const';

export default class Filter {
  constructor(filterContainer, filmsModel, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatsPageChange = this._handleStatsPageChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilter();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new NavView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setPageStatsChangeHandler(this._handleStatsPageChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleStatsPageChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.STATS, filterType);
  }

  _getFilter() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
      {
        type: FilterType.STATS,
      },
    ];
  }
}
