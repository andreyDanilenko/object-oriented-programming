import * as dayjs from 'dayjs';
import { getPopupClassName } from '../utils/util';
import SmartView from './smart';


const createCommentPopupTemplate = (comment) => {
  const { text, authorName, emoji, date } = comment;

  const parseDate = (d) => {
    let newDate;

    if (-604800000 < dayjs(d).diff()) {
      newDate = `${Math.floor(dayjs(d).diff() / -86400000)} days ago`;
      if (newDate === '1 days ago') {
        newDate = '1 day ago';
      }
      if (newDate === '0 days ago') {
        newDate = `${Math.floor(dayjs(d).diff() / -3600000)} hours ago`;
        if (newDate === '1 hours ago') {
          newDate = '1 hour ago';
        }
        if (newDate === '0 hours ago') {
          newDate = `${Math.floor(dayjs(d).diff() / -60000)} min ago`;
          if (newDate === '0 min ago') {
            newDate = 'now';
          }
        }
      }
    }

    if (-604800000 > dayjs(d).diff()) {
      newDate = dayjs(d).format('DD/MM/YYYY HH:mm');
    }

    return newDate;
  };

  const dateFormat = parseDate(date);

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-smile">
</span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${authorName}</span>
          <span class="film-details__comment-day">${dateFormat}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
</li>`;
};

const createPopupTemplate = (data) => {
  const date = dayjs(data.filmInfo.release.date).format('DD MMMM YYYY');
  const { releaseCountry } = data.filmInfo.release;
  const { title, alternativeTitle, totalRating, poster, ageRating, runtime, description, director, genres } = data.filmInfo;
  const { writers, actors } = data.filmInfo;
  const { watchlist, favorite, history } = data.userDetails;
  const { isEmoji, isEmojiName } = data;
  const comments = data.comments;
  const countComments = comments.length;
  const genreTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const getGenres = (genresFilm) => genresFilm.map(
    (genre) =>
      `<span class="film-details__genre">${genre}</span>`,
  ).join('');

  const filterItemsTemplate = comments
    .map((comment) => createCommentPopupTemplate(comment))
    .join('');

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

                <p class="film-details__age">${ageRating}</p>
          </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${totalRating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers.join(', ')}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors.join(', ')}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${date}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${runtime}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${releaseCountry}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">${genreTitle}</td>
                    <td class="film-details__cell">${getGenres(genres)}</td>
                  </tr>
                </table>

                <p class="film-details__film-description">${description}</p>
              </div>
            </div>

            <section class="film-details__controls">
              <button type="button" class="${getPopupClassName(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
              <button type="button" class="${getPopupClassName(history)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
              <button type="button" class="${getPopupClassName(favorite)}  film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
            </section>
          </div>

          <div class="film-details__bottom-container">

            ${filterItemsTemplate.length ? `<section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComments}</span></h3>
              <ul class="film-details__comments-list">
                      ${filterItemsTemplate}
              </ul>
              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label">
                 ${isEmoji ? `<img src="./images/emoji/${isEmojiName}.png" width="30" height="30" alt="emoji">` : ''}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"
                  ${isEmojiName === 'smile' ? 'checked' : ''}>
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"
                  ${isEmojiName === 'sleeping' ? 'checked' : ''}>
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"
                  ${isEmojiName === 'puke' ? 'checked' : ''}>
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"
                  ${isEmojiName === 'angry' ? 'checked' : ''}>
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
           </section>` : ''}
      </div>
    </form>
    </section>`;
};

export default class PopupCard extends SmartView {
  constructor(param) {
    super();
    this._data = PopupCard.parseParamToData(param);

    this._getClosePopupHandler = this._getClosePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiInputHandler = this._emojiInputHandler.bind(this);
    this._textAreaHandler = this._textAreaHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  // Метод возврата обработчиков после перерисовки
  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closePopupFilm);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
  }

  // метод хранящий внутренние обработчики
  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('input', this._emojiInputHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._textAreaHandler);
  }

  // Метод сохранения ввода текста в окно комментария
  _textAreaHandler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      textComment: evt.target.value,
    }, true);
  }

  // Метод подстановки смайлика и обновления данных
  _emojiInputHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {

      this.updateData({
        ...this._data,
        isEmoji: true,
        isEmojiName: evt.target.value,
        textComment: this.getElement().querySelector('.film-details__comment-input').value,
        scrollPosition: this.getElement().scrollTop,
      });
    }

    this.getElement().querySelector('.film-details__comment-input').value = this._data.textComment;
    this.getElement().scrollTop = this._data.scrollPosition;
  }

  // Перносим данные в состояние
  static parseParamToData(param) {
    return {
      ...param, isEmoji: false, isEmojiName: null, textComment: '',
    };
  }

  static parseDataToParam(data) {
    data = { ...data };

    delete data.textComment;
    delete data.isEmoji;
    delete data.isEmojiName;

    return data;
  }

  _getClosePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupFilm();

  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      userDetails: {
        ...this._data.userDetails,
        history: !this._data.userDetails.history,
      },
      scrollPosition: this.getElement().scrollTop,
    });

    this._callback.historyClick();
    this.getElement().scrollTop = this._data.scrollPosition;
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      userDetails: {
        ...this._data.userDetails,
        favorite: !this._data.userDetails.favorite,
      },
      scrollPosition: this.getElement().scrollTop,
    });

    this._callback.favoriteClick();
    this.getElement().scrollTop = this._data.scrollPosition;
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      userDetails: {
        ...this._data.userDetails,
        watchlist: !this._data.userDetails.watchlist,
      },
      scrollPosition: this.getElement().scrollTop,
    });

    this._callback.watchlistClick();
    this.getElement().scrollTop = this._data.scrollPosition;
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closePopupFilm = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._getClosePopupHandler);
  }
}

