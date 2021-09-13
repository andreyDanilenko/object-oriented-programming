import * as dayjs from 'dayjs';
import { api } from '../api';
import FilmsView from '../view/films';
import FilmsListMainView from '../view/films-list';
import StatisticView from '../view/stats';
import LoadingView from '../view/loading';
// import FilmsListCommentedView from '../view/films-list-commented';
// import FilmsListRatedView from '../view/films-list-rated';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import SortView from '../view/films-sort';
import FilmPresenter from './film';
import { filter } from '../utils/filters';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP, SortType, UpdateType, FilterType, StatsFilterType, UserAction } from '../utils/const';

export default class Films {
  constructor(filmsContainer, filmsModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._renderedCardCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;
    this._statsFilterType = StatsFilterType.ALL;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;
    this._filmNoCardComponent = null;
    this._userStatisticComponent = null;
    this._isLoading = true;

    this._filmsComponent = new FilmsView();
    this._filmsListMainComponent = new FilmsListMainView();
    this._loadingComponent = new LoadingView();

    this._newFilmData = new Map();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleStatsFilter = this._handleStatsFilter.bind(this);
    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderFilmsBoard();
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.slice().sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
      case SortType.RATING:
        return filtredFilms.slice().sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1);
    }

    return filtredFilms;
  }

  _handleUpdateFilm(updateType, update) {
    api.updateFilm(update).then((response) => {
      this._filmsModel.updateFilms(updateType, response);
    });
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilms(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        console.log(update.comments);
        // this._filmsModel.updateFilms(updateType, update);

        break;
      case UserAction.DELETE_COMMENT:
        console.log(update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._newFilmData.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmsList();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderFilmsBoard();
        break;
      case UpdateType.STATS:
        this._clearFilmsList();
        this._renderStats();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }

  // отрисовка блока сортировки
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  // Обработчик при клике на соответсвующую сортировку
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList({ resetRenderedFilmCount: true });
    this._renderFilmsBoard();
  }

  // Отрисовка страницы статистики
  _renderStats() {
    if (this._userStatisticComponent !== null) {
      this._userStatisticComponent = null;
    }

    this._filterType = FilterType.HISTORY;
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    this._userStatisticComponent = new StatisticView(this._statsFilterType, filtredFilms);
    render(this._filmsContainer, this._userStatisticComponent, RenderPosition.BEFOREEND);
    this._userStatisticComponent.setFilterTypeChangeHandler(this._handleStatsFilter);
  }

  _handleStatsFilter(statsFilter) {
    if (this._statsFilterType === statsFilter) {
      return;
    }

    this._statsFilterType = statsFilter;
    remove(this._userStatisticComponent);
    this._renderStats();
  }

  _clearFilmsList({ resetRenderedFilmCount = false, resetSortType = false,
    saveRenderedFilm = false } = {}) {
    this._newFilmData.forEach((presenter) => presenter.destroy());
    this._newFilmData.clear();

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._loadMoreButtonComponent);
    remove(this._userStatisticComponent);
    remove(this._filmsComponent);

    if (this._filmNoCardComponent) {
      remove(this._filmNoCardComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedCardCount = FILM_COUNT_PER_STEP;
    } else if (saveRenderedFilm) {
      const filmCount = this._getFilms().length;
      this._renderedCardCount = Math.min(filmCount, this._renderedCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
      this._statsFilterType = StatsFilterType.ALL;
    }
  }

  _renderLoading() {
    render(this._filmsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка одной карточки фильма
  _renderFlim(card) {
    const cardPresenter = new FilmPresenter(this.cardMainContainer, this._handleViewAction, this._filmsModel);
    cardPresenter.init(card);
    this._newFilmData.set(card.id, cardPresenter);
  }

  // отрисовка заданого массива карточек
  _renderFilms(cards) {
    cards.forEach((card) => this._renderFlim(card));
  }

  // Отрисовка контенера листа фильма и контейнера в листе фильма
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListMainComponent, RenderPosition.BEFOREEND);
    this.cardMainContainer = this._filmsListMainComponent.getElement().querySelector('.films-list__container');
  }

  // отрисока текста при отсутствии фильмов
  _renderNoFilmsList() {
    this._filmNoCardComponent = new FilmNoCardView(this._filterType);
    render(this._filmsContainer, this._filmNoCardComponent, RenderPosition.BEFOREEND);
  }

  // обрабочик при нажатии кнопки показать еще
  _handleLoadMoreButton() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(this._renderedCardCount, this._renderedCardCount + FILM_COUNT_PER_STEP);

    this._renderFilms(films);
    this._renderedCardCount += FILM_COUNT_PER_STEP;

    if (this._renderedCardCount >= filmCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  // отрисовка кнопки показать еще
  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButton);
    render(this._filmsListMainComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  // Отрисовка основного списка фильмов
  _renderFilmsBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderNoFilmsList();
      return;
    }

    this._renderSort();
    this._renderFilmsContainer();
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedCardCount)));

    if (filmCount > this._renderedCardCount) {
      this._renderLoadMoreButton();
    }
  }
}
