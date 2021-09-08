export const RATED_COUNT = 8;
export const FILM_COUNT_PER_STEP = 5;
export const FILM_COUNT_EXTRA = 2;
export const MAX_TEXT_LENGTH = 139;
export const BAR_HEIGHT = 50;
export const ZERO_FILMS_COUNT = 0;
export const MIN_FILMS_COUNT = 10;
export const MAX_FILMS_COUNT = 20;

export const generateToken = () => {
  const random = Math.random();
  return random.toString(32).substr(2);
};

export const StatsFilterType = {
  ALL: 'all-time',
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  TODAY: 'today',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilterType = {
  ALL: 'all',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  WATCHLIST: 'watchlist',
  STATS: 'stats',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  STATS: 'STATS',
  INIT: 'INIT',
};

export const ProfileRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};
