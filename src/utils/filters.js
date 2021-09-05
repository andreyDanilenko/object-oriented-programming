import { FilterType } from './const';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.history),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
};
