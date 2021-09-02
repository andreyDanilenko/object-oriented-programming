import * as dayjs from 'dayjs';
import FilmsView from '../view/films';
import FilmsListMainView from '../view/films-list';
import FilmsListCommentedView from '../view/films-list-commented';
import FilmsListRatedView from '../view/films-list-rated';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import SortView from '../view/films-sort';
import FilmPresenter from './film';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP, SortType } from '../utils/const';

export default class Films {
  constructor(filmsContainer, filmsModel) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListMainComponent = new FilmsListMainView();
    this._filmsListCommentedComponent = new FilmsListCommentedView();
    this._filmsListRatedComponent = new FilmsListRatedView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._filmNoCardComponent = new FilmNoCardView();

    this._newFilmData = new Map();

    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmsList();
  }

  _handleViewAction(update) {
    this._filmsModel.updateFilm(update);
  }

  _handleModelEvent(data) {
    this._newFilmData.get(data.id).init(data);
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        this._filmsModel.getFilms()
          .sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
        break;
      case SortType.RATING:
        this._filmsModel.getFilms()
          .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1);
        break;
    }

    return this._filmsModel.getFilms();
  }

  // отрисовка блока сортировки
  _renderSort() {
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // Обработчик при клике на соответсвующую сортировку
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderFilmsListMain();
  }

  // Очистка данных для отрисовки новых
  _clearFilmsList() {
    this._newFilmData.forEach((presenter) => presenter.destroy());
    this._newFilmData.clear();
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
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

  // Начальная отрисовка карточек фильма
  _renderFilmsListMain() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    this._renderFilms(films);

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
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
    render(this._filmsListMainComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButton);
  }

  // Отрисовка всего вида страницы
  _renderFilmsList() {
    if (this._getFilms() === 0) {
      this._renderNoFilmsList();
      return;
    }

    this._renderSort();
    this._renderFilmsContainer();
    this._renderFilmsListMain();
  }
}
