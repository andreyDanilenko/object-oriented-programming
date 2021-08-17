import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import { render, RenderPosition, replace, remove } from '../utils/render';


export default class Film {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._cardComponent = null;
    this._cardPopupComponent = null;

    this._handleOpenPopopClick = this._handleOpenPopopClick.bind(this);
    this._handleClosePopopClick = this._handleClosePopopClick.bind(this);
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

    this._cardComponent.setOpenClickHandler(this._handleOpenPopopClick);
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._cardPopupComponent.setCloseClickHandler(this._handleClosePopopClick);
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

    remove(prevCardComponent);
    remove(prevCardPopupComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._cardPopupComponent);
  }

  _handleHistoryClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          userDetails: {
            history: !this._card.userDetails.history,
            favorite: this._card.userDetails.favorite,
            watchlist: this._card.userDetails.watchlist,
            watchingDate: this._card.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          userDetails: {
            history: this._card.userDetails.history,
            favorite: !this._card.userDetails.favorite,
            watchlist: this._card.userDetails.watchlist,
            watchingDate: this._card.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          userDetails: {
            history: this._card.userDetails.history,
            favorite: this._card.userDetails.favorite,
            watchlist: !this._card.userDetails.watchlist,
            watchingDate: this._card.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleOpenPopopClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    render(document.body, this._cardPopupComponent, RenderPosition.BEFOREEND);
  }

  _handleClosePopopClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
  }
}
