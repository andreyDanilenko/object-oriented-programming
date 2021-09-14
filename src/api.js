import FilmsModel from './model/films';
const AUTHORIZATION = 'Basic fjdksfj934893fd';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({ url: 'movies' })
      .then(Api.toJSON)
      .then((movies) => movies.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {

    return this._load({ url: `comments/${filmId}` })
      .then(Api.toJSON)
      .then((comments) => comments.map(FilmsModel.adaptCommentToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(filmId, comments) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(FilmsModel.adaptCommentToServer(comments)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then((response) => ({
        film: FilmsModel.adaptToClient(response.movie),
        comments: response.comments.map(FilmsModel.adaptCommentToClient),
      }));
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

export const api = new Api(END_POINT, AUTHORIZATION);
