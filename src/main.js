import { createSiteProfileTemplate } from './view/header-profile.js';
import { createSiteNavTemplate } from './view/site-nav.js';
import { createSiteSortTemplate } from './view/films-sort';
import { createFilmListTemplate } from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmListExtraTemplate } from './view/films-list-extra.js';
import { createButtonMoreTemplate } from './view/button-more.js';
import { createStatisticsTemplate } from './view/statistics.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, createSiteProfileTemplate(), 'beforeend');

const siteMainElement = document.querySelector('.main');
render(siteMainElement, createSiteNavTemplate(), 'afterbegin');
render(siteMainElement, createSiteSortTemplate(), 'beforeend');
render(siteMainElement, createFilmListTemplate(), 'beforeend');

const films = document.querySelector('.films');
const filmsList = document.querySelector('.films-list');
const filmsListContainer = films.querySelector('.films-list__container');

for (let i = 0; i < 5; i++) {
  render(filmsListContainer, createFilmCardTemplate(), 'beforeend');
}

render(filmsList, createButtonMoreTemplate(), 'beforeend');

for (let i = 0; i < 2; i++) {
  render(films, createFilmListExtraTemplate(), 'beforeend');
}

const filmsListExtra = films.querySelectorAll('.films-list--extra');
filmsListExtra.forEach((item) => {
  const filmsListContainerExtra = item.querySelector('.films-list__container');
  for (let i = 0; i < 2; i++) {
    render(filmsListContainerExtra, createFilmCardTemplate(), 'beforeend');
  }
});

const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createStatisticsTemplate(), 'beforeend');

