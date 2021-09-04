import * as dayjs from 'dayjs';
import FilmsView from '../view/films';
import FilmsListMainView from '../view/films-list';
// import FilmsListCommentedView from '../view/films-list-commented';
// import FilmsListRatedView from '../view/films-list-rated';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import SortView from '../view/films-sort';
import FilmPresenter from './film';
import { filter } from '../utils/filters';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP, SortType } from '../utils/const';

export default class Films {
  constructor(filmsContainer, filmsModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListMainComponent = new FilmsListMainView();
    this._filmNoCardComponent = new FilmNoCardView();

    this._newFilmData = new Map();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelUpdateEvent = this._handleModelUpdateEvent.bind(this);
    this._handleModelFilterEvent = this._handleModelFilterEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelUpdateEvent);
    this._filterModel.addObserver(this._handleModelFilterEvent);
  }

  init() {
    this._renderFilmsBoard();
  }

  _handleViewAction(update) {
    this._filmsModel.updateFilm(update);
  }

  _handleModelUpdateEvent(data) {
    this._newFilmData.get(data.id).init(data);
  }

  _handleModelFilterEvent() {
    this._clearFilmsList({ resetRenderedFilmCount: true, resetSortType: true });
    this._renderFilmsBoard();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
      case SortType.RATING:
        return filtredFilms.sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1);
    }

    return filtredFilms;
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

  _clearFilmsList({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmCount = this._getFilms().length;
    this._newFilmData.forEach((presenter) => presenter.destroy());
    this._newFilmData.clear();

    remove(this._sortComponent);
    remove(this._filmNoCardComponent);
    remove(this._loadMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedCardCount = FILM_COUNT_PER_STEP;
    } else {

      this._renderedCardCount = Math.min(filmCount, this._renderedCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // отрисовка одной карточки фильма
  _renderFlim(card) {
    const cardPresenter = new FilmPresenter(this.cardMainContainer, this._handleViewAction);
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
