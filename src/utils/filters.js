import { FilterType } from './const';

export const filter = {
  [FilterType.ALL]: (films) => films.length,
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.history).length,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite).length,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist).length,
};
