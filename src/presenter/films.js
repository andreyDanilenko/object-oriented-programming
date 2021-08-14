import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListExtraView from '../view/films-list-extra';
import FilmsContainerView from '../view/films-container';
import LoadMoreButtonView from '../view/button-more';
import FilmCardView from '../view/film-card';
import FilmNoCardView from '../view/film-no-card';
import PopupCardView from '../view/popup';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP } from '../utils/const';

export default class Films {
  constructor(filmsMain) {
    this._filmsMain = filmsMain;
    this._renderedTaskCount = FILM_COUNT_PER_STEP;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListExtraComponent = new FilmsListExtraView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._filmNoCardComponent = new FilmNoCardView();

    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
  }

  init(cards) {
    this._cards = cards.slice();

    render(this._filmsMain, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms();
  }

  _renderFlimCard(card) {
    const filmCardComponent = new FilmCardView(card);
    const popupCardComponent = new PopupCardView(card);

    const openPopupCard = () => {
      if (document.querySelector('.film-details')) {
        document.querySelector('.film-details').remove();
      }
      render(document.body, popupCardComponent, RenderPosition.BEFOREEND);
    };

    const closePopupCard = () => {
      if (document.querySelector('.film-details')) {
        document.querySelector('.film-details').remove();
      }
    };

    filmCardComponent.setOpenClickHandler(openPopupCard);
    popupCardComponent.setCloseClickHandler(closePopupCard);

    render(this._filmsContainerComponent, filmCardComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCards(from, to) {
    this._cards
      .slice(from, to)
      .forEach((card) => this._renderFlimCard(card));
  }

  _renderFilmsContainer() {
    this._renderFilmCards(0, Math.min(this._cards.length, FILM_COUNT_PER_STEP));

    if (this._cards.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderNoFilmsList() {
    render(this._filmsContainerComponent, this._filmNoCardComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButton() {
    this._renderFilmCards(this._renderedTaskCount, this._renderedTaskCount + FILM_COUNT_PER_STEP);
    this._renderedTaskCount += FILM_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._cards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButton);
  }

  _renderFilms() {
    if (this._cards.length === 0) {
      this._renderNoFilmsList();
      return;
    }

    this._renderFilmsContainer();
  }
}
