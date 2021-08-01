export const createSiteNavTemplate = (param) => {
  const watch = [];
  const favorites = [];
  const history = [];

  param.forEach((objCard) => {
    if (objCard.user_details.watchlist) {
      watch.push(objCard.user_details.watchlist);
    }
    if (objCard.user_details.favorite) {
      favorites.push(objCard.user_details.favorite);
    }
    if (objCard.user_details.already_watched) {
      history.push(objCard.user_details.already_watched);
    }
  });

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watch.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
