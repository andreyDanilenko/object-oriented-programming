import * as dayjs from 'dayjs';
import FilmsView from '../view/films';
import FilmsListMainView from '../view/films-list';
import FilmsListContainerView from '../view/film-list-container';
import LoadMoreButtonView from '../view/button-more';
import FilmNoCardView from '../view/film-no-card';
import SortView from '../view/films-sort';
import FilmPresenter from './film';
import { render, remove, RenderPosition } from '../utils/render';
import { FILM_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../utils/const';


export default class FilmsMain {
  constructor(filmsContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._filmsContainer = filmsContainer;
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListMainComponent = new FilmsListMainView();
    this.FilmsListContainerView = new FilmsListContainerView();
    this._filmNoCardComponent = new FilmNoCardView();

    this._newFilmData = new Map();

    this._handleLoadMoreButton = this._handleLoadMoreButton.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._renderSort();

    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListMainComponent, RenderPosition.BEFOREEND);
    render(this._filmsListMainComponent, this.FilmsListContainerView, RenderPosition.BEFOREEND);

    this._renderFilmsList();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms()
          .sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));

      case SortType.RATING:
        return this._filmsModel.getFilms()
          .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1);
    }

    return this._filmsModel.getFilms();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._filmsModel.updateCard(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._filmsModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._filmsModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._newFilmData.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearCardList();
        this._renderFilmsList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearCardList({ resetRenderedTaskCount: true, resetSortType: true });
        this._renderFilmsList();
        break;
    }
  }

  _renderFlim(card) {
    const cardPresenter = new FilmPresenter(this.FilmsListContainerView, this._handleViewAction);
    cardPresenter.init(card);
    this._newFilmData.set(card.id, cardPresenter);
  }

  _renderFilms(cards) {
    cards.forEach((card) => this._renderFlim(card));
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearCardList({ resetRenderedTaskCount: true });
    this._renderFilmsList();
  }

  _clearCardList() {
    this._newFilmData.forEach((presenter) => presenter.destroy());
    this._newFilmData.clear();
    this._renderedCardCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButton() {
    const cardCount = this._getFilms().length;
    const newRenderCardCount = Math.min(cardCount, this._renderedCardCount + FILM_COUNT_PER_STEP);
    const cards = this._getFilms().slice(this._renderedCardCount, newRenderCardCount);

    this._renderFilms(cards);
    this._renderedCardCount = newRenderCardCount;

    if (this._renderedCardCount >= cardCount) {
      remove(this._loadMoreButtonComponent);

    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButton);

    render(this._filmsListMainComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilmsList() {
    render(this._filmsContainer, this._filmNoCardComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsList() {
    const cards = this._getFilms();
    const cardCount = cards.length;

    if (cardCount === 0) {
      this._renderNoFilmsList();
      return;
    }

    this._renderFilms(cards.slice(0, Math.min(cardCount, FILM_COUNT_PER_STEP)));

    if (cardCount > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
}
