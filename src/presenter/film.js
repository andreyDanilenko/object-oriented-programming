import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import { render, RenderPosition } from '../utils/render';


export default class Film {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._handleOpenPopopClick = this._handleOpenPopopClick.bind(this);
    this._handleClosePopopClick = this._handleClosePopopClick.bind(this);
  }

  init(card) {
    this._card = card;

    this._cardComponent = new FilmCardView(card);
    this._cardPopupComponent = new PopupCardView(card);

    this._cardComponent.setOpenClickHandler(this._handleOpenPopopClick);
    this._cardPopupComponent.setCloseClickHandler(this._handleClosePopopClick);

    render(this._filmContainer, this._cardComponent, RenderPosition.BEFOREEND);
  }


  _handleHistoryClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        { userDetails: { history: !this._card.userDetails.history } },
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
