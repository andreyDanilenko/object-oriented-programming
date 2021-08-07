import { createSiteProfileTemplate } from './view/header-profile.js';
import { createSiteNavTemplate } from './view/site-nav.js';
import { createSiteSortTemplate } from './view/films-sort';
import { createFilmListTemplate } from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmListExtraTemplate } from './view/films-list-extra.js';
import { createButtonMoreTemplate } from './view/button-more.js';
import { createStatisticsTemplate } from './view/statistics.js';
import { createPopupTemplate } from './view/popup.js';
import { RATED_COUNT, FILM_COUNT_PER_STEP } from './utils/const.js';
import { cardData } from './mock/data-card.js';
import { generateFilter } from './utils/filters.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const filters = generateFilter(cardData);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, createSiteProfileTemplate(), 'beforeend');
render(siteMainElement, createSiteNavTemplate(filters), 'beforeend');

const navFilmsElement = document.querySelectorAll('.main-navigation__item');
navFilmsElement.forEach((link) => {
  link.addEventListener('click', () => {
    navFilmsElement.forEach(((btn) => {
      btn.classList.remove('main-navigation__item--active');
    }));
    link.classList.add('main-navigation__item--active');
  });
});

render(siteMainElement, createSiteSortTemplate(), 'beforeend');
render(siteMainElement, createFilmListTemplate(), 'beforeend');

const films = document.querySelector('.films');
const filmsList = films.querySelector('.films-list');
const filmsListContainer = films.querySelector('.films-list__container');

for (let i = 0; i < Math.min(cardData.length, FILM_COUNT_PER_STEP); i++) {
  render(filmsListContainer, createFilmCardTemplate(cardData[i]), 'beforeend');
}

const linkCommentElement = document.querySelectorAll('.film-card__comments');
linkCommentElement.forEach((link, i) => {
  link.addEventListener('click', () => {
    render(siteFooterElement, createPopupTemplate(cardData[i]), 'afterend');
    const closePopup = document.querySelector('.film-details__close-btn');
    const popupDetails = document.querySelector('.film-details');
    closePopup.addEventListener('click', () => {
      popupDetails.remove();
    });
  });
});

if (cardData.length > FILM_COUNT_PER_STEP) {
  let renderedTaskCount = FILM_COUNT_PER_STEP;

  render(filmsList, createButtonMoreTemplate(), 'beforeend');

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cardData.slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
      .forEach((card) => {
        render(filmsListContainer, createFilmCardTemplate(card), 'beforeend');
      });
    renderedTaskCount += FILM_COUNT_PER_STEP;

    if (renderedTaskCount >= cardData.length) {
      loadMoreButton.remove();
    }
  });
}

const titleExtra = [{ title: 'Top rated' }, { title: 'Most commented' }];
for (let i = 0; i < 2; i++) {
  render(films, createFilmListExtraTemplate(titleExtra[i]), 'beforeend');
}

const filmsExtra = document.querySelector('.films');
const filmsExtraList = filmsExtra.querySelectorAll('.films-list--extra');

const ratedFilms = cardData
  .filter((card) => card.filmInfo.totalRating > RATED_COUNT)
  .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
  .slice(0, 2);
ratedFilms.forEach((card) => {
  const container = filmsExtraList[0].querySelector('.films-list__container');
  render(container, createFilmCardTemplate(card), 'beforeend');
});

const mostComments = cardData
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);
mostComments.forEach((card) => {
  const container = filmsExtraList[1].querySelector('.films-list__container');
  render(container, createFilmCardTemplate(card), 'beforeend');
});

const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createStatisticsTemplate(cardData), 'beforeend');
