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
import { FILM_COUNT_PER_STEP, FILM_COUNT_EXTRA, RATED_COUNT, SortType } from '../utils/const';
import { updateItem } from '../utils/util';

export default class Films {
  constructor(filmsContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._filmsContainer = filmsContainer;
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
    this._newFilmRatedData = new Map();
    this._newFilmCommentedData = new Map();

    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleCardRatedChange = this._handleCardRatedChange.bind(this);
    this._handleCardCommentedChange = this._handleCardCommentedChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(cards) {
    this._cards = cards.slice();
    this._sourcedFilmsCards = this._cards.slice();

    this._ratedDataFilms = [...cards]
      .filter((card) => card.filmInfo.totalRating > RATED_COUNT)
      .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
      .slice(0, 2);
    this._mostDataComments = [...cards]
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);

    this._renderFilms();
  }

  _getFilms() {
    return this._filmsModel.getFilms();
  }

  _handleCardChange(updatedFilm) {
    this._cards = updateItem(this._cards, updatedFilm);
    this._sourcedFilmsCards = updateItem(this._sourcedFilmsCards, updatedFilm);
    this._newFilmData.get(updatedFilm.id).init(updatedFilm);
  }

  _handleCardRatedChange(updatedFilm) {
    this._newFilmRatedData.get(updatedFilm.id).init(updatedFilm);
    this._ratedDataFilms = updateItem(this._ratedDataFilms, updatedFilm);
  }

  _handleCardCommentedChange(updatedFilm) {
    this._newFilmCommentedData.get(updatedFilm.id).init(updatedFilm);
    this._mostDataComments = updateItem(this._mostDataComments, updatedFilm);
  }

  _renderFlimCard(container, card, type = '') {
    if (type === 'rated') {
      const filmCardRated = new FilmPresenter(container, this._handleCardRatedChange);
      filmCardRated.init(card);
      this._newFilmRatedData.set(card.id, filmCardRated);
      return;
    }

    if (type === 'commented') {
      const filmCardCommented = new FilmPresenter(container, this._handleCardCommentedChange);
      filmCardCommented.init(card);
      this._newFilmCommentedData.set(card.id, filmCardCommented);
      return;
    }

    const cardPresenter = new FilmPresenter(container, this._handleCardChange);
    cardPresenter.init(card);
    this._newFilmData.set(card.id, cardPresenter);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._cards
          .sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
        break;
      case SortType.RATING:
        this._cards
          .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1);
        break;
      default:
        this._cards = this._sourcedFilmsCards.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearCardList();
    this._renderFilms();
  }

  _clearCardList() {
    this._newFilmData.forEach((presenter) => presenter.destroy());
    this._newFilmCommentedData.forEach((presenter) => presenter.destroy());
    this._newFilmRatedData.forEach((presenter) => presenter.destroy());
    this._newFilmData.clear();
    this._newFilmCommentedData.clear();
    this._newFilmRatedData.clear();
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCards(container, from, to, cardData, type) {
    cardData
      .slice(from, to)
      .forEach((card) => this._renderFlimCard(container, card, type));
  }

  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListMain() {
    render(this._filmsComponent, this._filmsListMainComponent, RenderPosition.BEFOREEND);
    this.cardMainContainer = this._filmsListMainComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this.cardMainContainer, 0, FILM_COUNT_PER_STEP, this._cards);

    if (this._cards.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmsListRated() {
    render(this._filmsComponent, this._filmsListRatedComponent, RenderPosition.BEFOREEND);
    this.cardRatedContainer = this._filmsListRatedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this.cardRatedContainer, 0, FILM_COUNT_EXTRA, this._ratedDataFilms, 'rated');
  }

  _renderFilmsListCommented() {
    render(this._filmsComponent, this._filmsListCommentedComponent, RenderPosition.BEFOREEND);
    this.cardComentedContainer = this._filmsListCommentedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this.cardComentedContainer, 0, FILM_COUNT_EXTRA, this._mostDataComments, 'commented');
  }

  _renderNoFilmsList() {
    render(this._filmsContainer, this._filmNoCardComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButton() {
    this._renderFilmCards(this.cardMainContainer, this._renderedCardCount, this._renderedCardCount + FILM_COUNT_PER_STEP, this._cards);
    this._renderedCardCount += FILM_COUNT_PER_STEP;

    if (this._renderedCardCount >= this._cards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListMainComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButton);
  }

  _renderFilms() {
    if (this._cards.length === 0) {
      this._renderNoFilmsList();
      return;
    }

    this._renderSort();
    this._renderFilmsContainer();
    this._renderFilmsListMain();
    this._renderFilmsListRated();
    this._renderFilmsListCommented();
  }
}
