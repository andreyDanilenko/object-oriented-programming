import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import CommentsModel from '../model/comments';
import { render, RenderPosition, replace, remove } from '../utils/render';
import { UpdateType, UserAction } from '../utils/const';
import { api } from '../api';

export default class Film {
  constructor(filmContainer, changeData, filmsModel) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._filmsModel = filmsModel;

    this._cardComponent = null;
    this._commentsModel = new CommentsModel();

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

  init(card, comments = []) {
    this._card = card;
    this._comments = comments;

    const prevCardComponent = this._cardComponent;

    this._cardComponent = new FilmCardView(card);

    if (this._cardPopupComponent) {
      this._renderFilmPopup(this._comments);
    }

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

  _renderFilmPopup(comments = []) {
    if (this._cardPopupComponent) {
      remove(this._cardPopupComponent);
    }

    document.removeEventListener('keydown', this._handleCloseEscClick);
    this._cardPopupComponent = new PopupCardView(this._card, comments);
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          history: !this._card.userDetails.history,
        },
      });
  }

  _handleFavoriteClick(card) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...card,
        userDetails: {
          ...card.userDetails,
          favorite: !card.userDetails.favorite,
        },
      });
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          watchlist: !this._card.userDetails.watchlist,
        },
      });
  }

  _handleEditPopup(card) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      card);
  }

  _handleDeleteClick(commentId, filmId) {
    api.deleteComment(commentId).then(() => {
      this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH_COMMENTS,
        {
          commentId,
          filmId,
        },
      );
    });
  }

  _handleAddClick(card, newComment) {
    api.addComment(card.id, newComment).then((response) => {
      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH_COMMENTS,
        response ,
      );
    }).catch(
    );
  }

  _handleOpenPopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    this._renderFilmPopup();
    api.getComments(this._card.id).then((comments) => {
      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH_COMMENTS,
        {
          film: this._card,
          comments,
        } ,
      );
    });
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
