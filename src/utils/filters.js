const cardToFilterMap = {
  Favorites: (tasks) => tasks.filter((task) => task.userDetails.favorite).length,
  History: (tasks) => tasks.filter((task) => task.userDetails.history).length,
  Watchlist: (tasks) => tasks.filter((task) => task.userDetails.watchlist).length,
};

export const generateFilter = (tasks) => Object.entries(cardToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(tasks),
  }),
);
