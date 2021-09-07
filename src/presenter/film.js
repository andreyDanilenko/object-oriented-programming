import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import { render, RenderPosition, replace, remove } from '../utils/render';
import { UpdateType } from '../utils/const';

export default class Film {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._cardComponent = null;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleCloseEscClick = this._handleCloseEscClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleAddClick = this._handleAddClick.bind(this);
    this._handleEditPopup = this._handleEditPopup.bind(this);
  }

  init(card) {
    this._card = card;

    const prevCardComponent = this._cardComponent;

    this._cardComponent = new FilmCardView(card);
    this._cardComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevCardComponent === null) {
      render(this._filmContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
  }

  _renderFilmPopup() {
    if (this._cardPopupComponent) {
      remove(this._cardPopupComponent);
    }

    this._cardPopupComponent = new PopupCardView(this._card);
    this._cardPopupComponent.setCloseClickHandler(this._handleClosePopupClick);
    this._cardPopupComponent.setHistoryClickHandler(this._handleEditPopup);
    this._cardPopupComponent.setFavoriteClickHandler(this._handleEditPopup);
    this._cardPopupComponent.setWatchlistClickHandler(this._handleEditPopup);
    this._cardPopupComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._cardPopupComponent.setAddClickHandler(this._handleAddClick);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._handleCloseEscClick);
    render(document.body, this._cardPopupComponent, RenderPosition.BEFOREEND);
  }

  _handleHistoryClick() {
    this._changeData(
      UpdateType.MAJOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          history: !this._card.userDetails.history,
        },
      });
  }

  _handleFavoriteClick() {
    this._changeData(
      UpdateType.MAJOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          favorite: !this._card.userDetails.favorite,
        },
      });
  }

  _handleWatchlistClick() {
    this._changeData(
      UpdateType.MAJOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          watchlist: !this._card.userDetails.watchlist,
        },
      });
  }

  // Временно пока не разберусь как синхронизировать изменения попапа чс карточкой
  // Не могу придумать как перерисовывать открытый попап при клике
  // на кнопки добавлений в определенный список карточки фильма
  _handleEditPopup(card) {
    this._changeData(
      UpdateType.MAJOR,
      card);
  }

  _handleDeleteClick(card) {
    this._changeData(
      UpdateType.PATCH,
      card,
    );
  }

  _handleAddClick(card) {
    this._changeData(
      UpdateType.PATCH,
      card,
    );
  }

  _handleOpenPopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    this._renderFilmPopup();
  }

  _handleClosePopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleCloseEscClick);
  }

  _handleCloseEscClick(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._handleClosePopupClick();
    }
  }
}
