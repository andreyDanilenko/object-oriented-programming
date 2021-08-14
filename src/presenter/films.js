import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsContainerView from '../view/films-container';
import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP } from '../utils/const';

export default class Films {
  constructor(filmsMain) {
    this._filmsMain = filmsMain;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._filmNoCardComponent = new FilmNoCardView();
  }

  init(cards) {
    // Метод возврращающий копию передающего в него массива для того чтобы создавать новую отричовку
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

  _renderLoadMoreButton() {
    let renderedTaskCount = FILM_COUNT_PER_STEP;

    render(this._filmsListComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const loadMoreButton = document.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._cards.slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
        .forEach((card) => {
          this._renderFlimCard(card);
        });
      renderedTaskCount += FILM_COUNT_PER_STEP;

      if (renderedTaskCount >= this._cards.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _renderFilms() {
    if (this._cards.length === 0) {
      this._renderNoFilmsList();
      return;
    }

    this._renderFilmsContainer();
  }
}
