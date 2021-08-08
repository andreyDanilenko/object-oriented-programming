import SiteProfileView from './view/header-profile';
import SiteNavView from './view/site-nav';
import SiteSortView from './view/films-sort';
import SiteFilmsListView from './view/films-list';
import SiteFilmCardView from './view/film-card';
import SiteFilmsListExtraView from './view/films-list-extra';
import LoadMoreButtonView from './view/button-more';
import SiteStatisticView from './view/statistics';
import SitePopupCardView from './view/popup';
import SiteFilmNoCardView from './view/film-no-card';

import { RATED_COUNT, FILM_COUNT_PER_STEP } from './utils/const';
import { cardData } from './mock/data-card';
import { generateFilter } from './utils/filters';
import { render } from './utils/util';

const filters = generateFilter(cardData);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const renderFilmCard = (container, data) => {
  const filmCardComponent = new SiteFilmCardView(data);
  const popupCardComponent = new SitePopupCardView(data);

  const openPopupCard = () => {
    render(siteFooterElement, popupCardComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      document.querySelector('.film-details').remove();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    openPopupCard();
    document.addEventListener('keydown', onEscKeyDown);
  });

  popupCardComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    document.querySelector('.film-details').remove();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(container, filmCardComponent.getElement());
};

render(siteMainElement, new SiteNavView(filters).getElement());
render(siteMainElement, new SiteSortView().getElement());
render(siteMainElement, new SiteFilmsListView().getElement());

const films = document.querySelector('.films');
const filmsListContainer = films.querySelector('.films-list__container');

for (let i = 0; i < Math.min(cardData.length, FILM_COUNT_PER_STEP); i++) {
  renderFilmCard(filmsListContainer, cardData[i]);
}

if (cardData.length > FILM_COUNT_PER_STEP) {
  let renderedTaskCount = FILM_COUNT_PER_STEP;
  const filmsList = films.querySelector('.films-list');
  render(filmsList, new LoadMoreButtonView().getElement());

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cardData.slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
      .forEach((card) => {
        renderFilmCard(filmsListContainer, card);
      });
    renderedTaskCount += FILM_COUNT_PER_STEP;

    if (renderedTaskCount >= cardData.length) {
      loadMoreButton.remove();
    }
  });
}


render(siteHeaderElement, new SiteProfileView().getElement());


const titleExtra = [{ title: 'Top rated' }, { title: 'Most commented' }];
for (let i = 0; i < 2; i++) {
  render(films, new SiteFilmsListExtraView(titleExtra[i]).getElement());
}

const filmsExtraList = films.querySelectorAll('.films-list--extra');
const ratedFilms = cardData
  .filter((card) => card.filmInfo.totalRating > RATED_COUNT)
  .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
  .slice(0, 2);
ratedFilms.forEach((card) => {
  const container = filmsExtraList[0].querySelector('.films-list__container');
  renderFilmCard(container, card);
});

const mostComments = cardData
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);
mostComments.forEach((card) => {
  const container = filmsExtraList[1].querySelector('.films-list__container');
  renderFilmCard(container, card);
});

const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new SiteStatisticView(cardData).getElement());
