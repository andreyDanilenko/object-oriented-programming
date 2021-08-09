const cardToFilterMap = {
  Favorites: 'favorite',
  History: 'history',
  Watchlist: 'watchlist',
};

export const generateFilter = (tasks) => Object.entries(cardToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: tasks.filter((task) => task.userDetails[countTasks]).length,
  }),
);
