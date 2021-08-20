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
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListMainComponent = new FilmsListMainView();
    this._FilmsListCommentedComponent = new FilmsListCommentedView();
    this._FilmsListRatedComponent = new FilmsListRatedView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._filmNoCardComponent = new FilmNoCardView();
    this._newFilmData = new Map();

    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(cards) {
    this._cards = cards.slice();
    this._sourcedFilmsCards = this._cards.slice();

    this._renderFilms();
  }

  _renderFlimCard(container, card) {
    const cardPresenter = new FilmPresenter(container, this._handleCardChange);
    cardPresenter.init(card);
    this._newFilmData.set(card.id, cardPresenter);
  }

  _handleCardChange(updatedFilm) {
    this._cards = updateItem(this._cards, updatedFilm);
    this._sourcedFilmsCards = updateItem(this._sourcedFilmsCards, updatedFilm);
    this._newFilmData.get(updatedFilm.id).init(updatedFilm);
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
    this._newFilmData.clear();
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCards(container, from, to, cardData) {
    cardData
      .slice(from, to)
      .forEach((card) => this._renderFlimCard(container, card));
  }

  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListMain() {
    render(this._filmsComponent, this._filmsListMainComponent, RenderPosition.BEFOREEND);
    this.cardMainContainer = this._filmsListMainComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this.cardMainContainer, 0, Math.min(this._cards.length, FILM_COUNT_PER_STEP), this._cards);

    if (this._cards.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmsListRated() {
    render(this._filmsComponent, this._FilmsListRatedComponent, RenderPosition.BEFOREEND);
    this.cardRatedContainer = this._FilmsListRatedComponent.getElement().querySelector('.films-list__container');
    this._ratedFilms = this._cards
      .filter((card) => card.filmInfo.totalRating > RATED_COUNT)
      .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
      .slice(0, 2);
    this._renderFilmCards(this.cardRatedContainer, 0, Math.min(this._ratedFilms.length, FILM_COUNT_EXTRA), this._ratedFilms);
  }

  _renderFilmsListCommented() {
    render(this._filmsComponent, this._FilmsListCommentedComponent, RenderPosition.BEFOREEND);
    this.cardComentedContainer = this._FilmsListCommentedComponent.getElement().querySelector('.films-list__container');
    this._mostComments = this._cards
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);
    this._renderFilmCards(this.cardComentedContainer, 0, Math.min(this._ratedFilms.length, FILM_COUNT_EXTRA), this._mostComments);
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
