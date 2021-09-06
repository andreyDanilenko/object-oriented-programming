import * as dayjs from 'dayjs';
import { MAX_LENGTH_TEXT } from './const';
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getFirstElement = (arr) => arr[0];
export const getCardClassName = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
export const getPopupClassName = (variable) => variable ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button';
export const getSliceText = (text) => {
  let newText = text.slice(0, MAX_LENGTH_TEXT);
  if (text.length > newText.length) {
    newText += '...';
  }
  return newText;
};

export const parseDate = (d) => {
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

export const getSumRuntime = (data) => {
  const runtime = [];
  data.forEach((film) => {
    runtime.push(film.filmInfo.runtime);
  });
  const sum = runtime.reduce((a, b) => a + b, 0);
  return sum;
};

export const getGenres = (films) => {
  const genres = new Set();

  films.forEach((film) => film.filmInfo.genres.forEach((genre) => genres.add(genre)));

  return genres;
};

export const getDataGenres = (films, count) => {
  const allMoviesGenres = [];
  films.forEach((film) => allMoviesGenres.push(...film.filmInfo.genres));

  const dataGenres = [];
  getGenres(films).forEach((genre) =>
    dataGenres.push({
      genre: genre,
      count: allMoviesGenres.filter((allMoviesgenre) => allMoviesgenre === genre).length,
    }),
  );
  const newGenres = dataGenres.sort((a, b) => (b.count > a.count) ? 1 : -1);

  const counts = [];
  const genres = [];

  newGenres.forEach((i) => {
    counts.push(i.count);
    genres.push(i.genre);
  });

  if (count) {
    return counts;
  }
  return genres;
};
