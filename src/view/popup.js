import * as dayjs from 'dayjs';
import he from 'he';
import { getPopupClassName, parseDate } from '../utils/util';
import SmartView from './smart';

const createCommentPopupTemplate = (dataComment) => {
  const { text, authorName, emoji, date, id } = dataComment;
  const dateFormat = parseDate(date);
  return `<li class="film-details__comment" value=${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${authorName}</span>
          <span class="film-details__comment-day">${dateFormat}</span>
          <button class="film-details__comment-delete" value=${id}>Delete</button>
        </p>
      </div>
</li>`;
};

const createPopupTemplate = (data, dataComment) => {
  const date = dayjs(data.filmInfo.release.date).format('DD MMMM YYYY');
  const { releaseCountry } = data.filmInfo.release;
  const { title, alternativeTitle, totalRating, poster, ageRating, runtime, description, director, genres } = data.filmInfo;
  const { writers, actors } = data.filmInfo;
  const runtimeHourse = Math.floor(runtime / 60);
  const runtimeMinutes = runtime % 60;
  const { watchlist, favorite, history } = data.userDetails;
  const { isEmojiName } = data;
  const comments = dataComment;
  const countComments = comments.length;
  const genreTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const commentsTitle = countComments === 1 ? 'Comment' : 'Comments';
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
              <img class="film-details__poster-img" src="${poster}" alt="">

                <p class="film-details__age">${ageRating}+</p>
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
                    <td class="film-details__cell">${runtimeHourse}h ${runtimeMinutes}m</td>
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

                <p class="film-details__film-description">${he.encode(description)}</p>
              </div>
            </div>

            <section class="film-details__controls">
              <button type="button" class="${getPopupClassName(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
              <button type="button" class="${getPopupClassName(history)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
              <button type="button" class="${getPopupClassName(favorite)}  film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
            </section>
          </div>

          <div class="film-details__bottom-container">

          <section class="film-details__comments-wrap">
              ${filterItemsTemplate.length ? `  <h3 class="film-details__comments-title">${commentsTitle} <span class="film-details__comments-count">${countComments}</span></h3>
              <ul class="film-details__comments-list">
                      ${filterItemsTemplate}
              </ul>` : ''}
              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label">
                 ${isEmojiName !== null ? `<img src="./images/emoji/${isEmojiName}.png" width="55" height="55" alt="emoji">` : ''}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"
                  ${isEmojiName === 'smile' ? 'checked' : ''} >
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

           </section>
      </div >
    </form >
    </section > `;
};

export default class PopupCard extends SmartView {
  constructor(param, comment) {
    super();
    this._data = PopupCard.parseParamToData(param);
    this._comments = comment;

    this._getClosePopupHandler = this._getClosePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiInputHandler = this._emojiInputHandler.bind(this);
    this._textAreaHandler = this._textAreaHandler.bind(this);
    this._getDeleteClickHandler = this._getDeleteClickHandler.bind(this);
    this._getAddClickHandler = this._getAddClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments);
  }

  // Метод возврата обработчиков после перерисовки
  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closePopupFilm);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setAddClickHandler(this._callback.addClick);
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
      textComment: '',
    }, true);
  }

  // Метод подстановки смайлика и обновления данных
  _emojiInputHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {

      this.updateData({
        ...this._data,
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
      ...param, isEmojiName: null, textComment: '',
    };
  }

  static parseDataToParam(data) {
    data = { ...data };

    delete data.textComment;
    delete data.isEmojiName;
    delete data.scrollPosition;

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

    this.getElement().scrollTop = this._data.scrollPosition;
    this._callback.historyClick(PopupCard.parseDataToParam(this._data));
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

    this.getElement().scrollTop = this._data.scrollPosition;
    this._callback.favoriteClick(PopupCard.parseDataToParam(this._data));
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

    this.getElement().scrollTop = this._data.scrollPosition;
    this._callback.watchlistClick(PopupCard.parseDataToParam(this._data));
  }

  _getDeleteClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    const index = this._comments.findIndex((comment) => comment.id === evt.target.value);
    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this.updateData(
      { ...this._data, comments: this._comments, scrollPosition: this.getElement().scrollTop },
    );

    evt.preventDefault();
    this.getElement().scrollTop = this._data.scrollPosition;
    this._callback.deleteClick(PopupCard.parseDataToParam(this._data));
  }

  _getAddClickHandler(evt) {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      const newComment = {
        text: he.encode(this.getElement().querySelector('.film-details__comment-input').value),
        emoji: this._data.isEmojiName ? `${this._data.isEmojiName}` : 'smile',
      };

      this._comments = [...this._comments, newComment];
      this.updateData(
        { ...this._data, comments: this._comments, scrollPosition: this.getElement().scrollTop },
      );

      this.getElement().scrollTop = this._data.scrollPosition;
      this._callback.addClick(PopupCard.parseDataToParam(this._data));
    }
  }


  setAddClickHandler(callback) {
    this._callback.addClick = callback;
    this.getElement().querySelector('.film-details__comments-wrap').addEventListener('keydown', this._getAddClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.film-details__comments-wrap').addEventListener('click', this._getDeleteClickHandler);
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

