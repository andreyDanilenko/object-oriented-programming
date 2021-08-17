import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListCommentedView from '../view/films-list-commented';
import FilmsListRatedView from '../view/films-list-rated';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import SortView from '../view/films-sort';
import FilmPresenter from './film';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP, FILM_COUNT_EXTRA, RATED_COUNT } from '../utils/const';
import { updateItem } from '../utils/util';

export default class Films {
  constructor(filmsMain) {
    this._filmsMain = filmsMain;
    this._renderedTaskCount = FILM_COUNT_PER_STEP;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListMainComponent = new FilmsListView();
    this._FilmsListCommentedComponent = new FilmsListCommentedView();
    this._FilmsListRatedComponent = new FilmsListRatedView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._filmNoCardComponent = new FilmNoCardView();
    this._newFilmDate = new Map();

    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
  }

  init(cards) {
    this._cards = cards.slice();
    this._renderSort();
    this._renderFilms();
  }

  _renderSort() {
    render(this._filmsMain, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFlimCard(container, card) {
    const cardPresenter = new FilmPresenter(container, this._handleCardChange);
    cardPresenter.init(card);
    this._newFilmDate.set(card.id, cardPresenter);
  }

  _handleCardChange(updatedFilm) {
    this._cards = updateItem(this._cards, updatedFilm);
    this._newFilmDate.get(updatedFilm.id).init(updatedFilm);
  }

  _renderFilmCards(container, from, to, cardData) {
    cardData
      .slice(from, to)
      .forEach((card) => this._renderFlimCard(container, card));
  }

  _renderFilmsContainer() {
    render(this._filmsMain, this._filmsComponent, RenderPosition.BEFOREEND);
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
    render(this._filmsContainerComponent, this._filmNoCardComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButton() {
    this._renderFilmCards(this.cardMainContainer, this._renderedTaskCount, this._renderedTaskCount + FILM_COUNT_PER_STEP, this._cards);
    this._renderedTaskCount += FILM_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._cards.length) {
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

    this._renderFilmsContainer();
    this._renderFilmsListMain();
    this._renderFilmsListRated();
    this._renderFilmsListCommented();
  }
}
