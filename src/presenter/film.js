import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import { render, RenderPosition, replace, remove } from '../utils/render';

export default class Film {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._cardComponent = null;
    this._cardPopupComponent = null;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(card) {
    this._card = card;

    const prevCardComponent = this._cardComponent;
    const prevCardPopupComponent = this._cardPopupComponent;

    this._cardComponent = new FilmCardView(card);
    this._cardPopupComponent = new PopupCardView(card);

    this._cardComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._cardPopupComponent.setCloseClickHandler(this._handleClosePopupClick);
    this._cardPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._cardPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevCardComponent === null) {
      render(this._filmContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (document.body.contains(prevCardPopupComponent.getElement())) {
      replace(this._cardPopupComponent, prevCardPopupComponent);
    }

    remove(prevCardPopupComponent);
    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._cardPopupComponent);
  }

  _handleHistoryClick() {
    this._changeData({
      ...this._card,
      userDetails: {
        ...this._card.userDetails,
        history: !this._card.userDetails.history,
      },
    });
  }

  _handleFavoriteClick() {
    this._changeData({
      ...this._card,
      userDetails: {
        ...this._card.userDetails,
        favorite: !this._card.userDetails.favorite,
      },
    });
  }

  _handleWatchlistClick() {
    this._changeData({
      ...this._card,
      userDetails: {
        ...this._card.userDetails,
        watchlist: !this._card.userDetails.watchlist,
      },
    });
  }

  _handleOpenPopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    render(document.body, this._cardPopupComponent, RenderPosition.BEFOREEND);
  }

  _handleClosePopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
  }
}
