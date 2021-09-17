import * as dayjs from 'dayjs';
import { api } from '../api';
import FilmsView from '../view/films';
import FilmsListMainView from '../view/films-list';
import StatisticView from '../view/stats';
import LoadingView from '../view/loading';
import FilmsListCommentedView from '../view/films-list-commented';
import FilmsListRatedView from '../view/films-list-rated';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import SortView from '../view/films-sort';
import FilmPresenter from './film';
import { filter } from '../utils/filters';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP, RATED_COUNT, SortType, UpdateType, FilterType, StatsFilterType, UserAction } from '../utils/const';

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
    this._filmsListCommentedComponent = new FilmsListCommentedView();
    this._filmsListRatedComponent = new FilmsListRatedView();

    this._newDataFilm = new Map();
    this._topRatedDataFilm = new Map();
    this._mostCommentedDataFilm = new Map();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleStatsFilter = this._handleStatsFilter.bind(this);
    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.LOAD_COMMENTS:
        api.getComments(update.film.id).then((comments) => {
          update.comments = comments;
          this._filmsModel.addComment(updateType, update);
        });
        break;
      case UserAction.UPDATE_FILM:
        api.updateFilm(update).then((film) => {
          api.getComments(update.id).then((comments) => {
            this._comments = comments;
            this._filmsModel.updateFilms(updateType, { film, comments });
          });
        });
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.deleteComment(updateType, update);
        break;
    }
  }

  _initFilmCardViewPresenter(presenters, data) {
    if (presenters.has(data.film.id)) {
      presenters.get(data.film.id).init(data.film, data.comments);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._initFilmCardViewPresenter(this._newDataFilm, data);
        this._initFilmCardViewPresenter(this._topRatedDataFilm, data);
        this._initFilmCardViewPresenter(this._mostCommentedDataFilm, data);
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
    this._newDataFilm.forEach((presenter) => presenter.destroy());
    this._topRatedDataFilm.forEach((presenter) => presenter.destroy());
    this._mostCommentedDataFilm.forEach((presenter) => presenter.destroy());
    this._newDataFilm.clear();
    this._topRatedDataFilm.clear();
    this._mostCommentedDataFilm.clear();

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
  _renderFlim(card, container, data) {
    const cardPresenter = new FilmPresenter(container, this._handleViewAction, this._filterType);
    cardPresenter.init(card);
    data.set(card.id, cardPresenter);
  }

  // отрисовка заданого массива карточек
  _renderFilms(cards, container, data) {
    cards.forEach((card) => this._renderFlim(card, container, data));
  }

  // Отрисовка контенера листа фильма и контейнера в листе фильма
  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsMain() {
    render(this._filmsComponent, this._filmsListMainComponent, RenderPosition.BEFOREEND);
    this.cardMainContainer = this._filmsListMainComponent.getElement().querySelector('.films-list__container');

    const films = this._getFilms();
    const filmCount = films.length;

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedCardCount)), this.cardMainContainer, this._newDataFilm);
  }

  _renderFilmsRated() {
    render(this._filmsComponent, this._filmsListRatedComponent, RenderPosition.BEFOREEND);
    this._cardRatedContainer = this._filmsListRatedComponent.getElement().querySelector('.films-list__container');

    const filmsTopRated = this._filmsModel.getFilms().filter((card) => card.filmInfo.totalRating > RATED_COUNT)
      .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
      .slice(0, 2);
    this._renderFilms(filmsTopRated, this._cardRatedContainer, this._topRatedDataFilm);
  }

  _renderFilmsCommented() {
    render(this._filmsComponent, this._filmsListCommentedComponent, RenderPosition.BEFOREEND);
    this._cardMostCommentedContainer = this._filmsListCommentedComponent.getElement().querySelector('.films-list__container');

    const filmsMostCommented = this._filmsModel.getFilms().slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);
    this._renderFilms(filmsMostCommented, this._cardMostCommentedContainer, this._mostCommentedDataFilm);
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

    this._renderFilms(films, this.cardMainContainer, this._newDataFilm);
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
      this._renderFilmsContainer();
      this._renderFilmsRated();
      this._renderFilmsCommented();
      return;
    }

    this._renderSort();
    this._renderFilmsContainer();
    this._renderFilmsMain();
    this._renderFilmsRated();
    this._renderFilmsCommented();

    if (filmCount > this._renderedCardCount) {
      this._renderLoadMoreButton();
    }
  }
}
