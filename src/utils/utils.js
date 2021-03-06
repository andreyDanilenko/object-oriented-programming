import * as dayjs from 'dayjs';
import { MAX_TEXT_LENGTH, StatsFilterType, ProfileRank, ZERO_FILMS_COUNT, MAX_FILMS_COUNT, MIN_FILMS_COUNT } from './const';

export const getFirstElement = (arr) => arr[0];
export const getCardClassName = (variable) => variable ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
export const getPopupClassName = (variable) => variable ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button';
export const getSliceText = (text) => text.length > MAX_TEXT_LENGTH ? `${text.slice(0, MAX_TEXT_LENGTH)}...` : text;

export const isWatchingDate = (date, sortType) => {
  switch (sortType) {
    case StatsFilterType.ALL:
      return date;
    case StatsFilterType.YEAR:
      return date = date.filter((film) => dayjs(film.userDetails.watchingDate).diff() > -31536000000);
    case StatsFilterType.MONTH:
      return date = date.filter((film) => dayjs(film.userDetails.watchingDate).diff() > -2592000000);
    case StatsFilterType.WEEK:
      return date = date.filter((film) => dayjs(film.userDetails.watchingDate).diff() > -604800000);
    case StatsFilterType.TODAY:
      return date = date.filter((film) => dayjs(film.userDetails.watchingDate).diff() > -86400000);
  }
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

export const getUserRank = (watchedCount) => {
  const isNoviceRank = watchedCount > ZERO_FILMS_COUNT && watchedCount <= MIN_FILMS_COUNT;
  const isFanRank = watchedCount > MIN_FILMS_COUNT && watchedCount <= MAX_FILMS_COUNT;
  const isMovieBuffRank = watchedCount > MAX_FILMS_COUNT;

  if (isNoviceRank) {
    return ProfileRank.NOVICE;
  } else if (isFanRank) {
    return ProfileRank.FAN;
  } else if (isMovieBuffRank) {
    return ProfileRank.MOVIE_BUFF;
  } else {
    return '';
  }
};
