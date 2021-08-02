import { createSiteProfileTemplate } from './view/header-profile.js';
import { createSiteNavTemplate } from './view/site-nav.js';
import { createSiteSortTemplate } from './view/films-sort';
import { createFilmListTemplate } from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmListExtraTemplate } from './view/films-list-extra.js';
import { createButtonMoreTemplate } from './view/button-more.js';
import { createStatisticsTemplate } from './view/statistics.js';

import { createPopupTemplate } from './view/popup.js';

import { dataCard } from './mock/data-card.js';
// eslint-disable-next-line no-console
console.log(dataCard);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, createSiteProfileTemplate(), 'beforeend');
render(siteMainElement, createSiteNavTemplate(dataCard), 'beforeend');

const navFilms = document.querySelectorAll('.main-navigation__item');

navFilms.forEach((link) => {
  link.addEventListener('click', () => {
    const navFilmsNew = document.querySelectorAll('.main-navigation__item');

    navFilmsNew.forEach(((btn) => {
      if (btn.classList.contains('main-navigation__item--active')) {
        btn.classList.remove('main-navigation__item--active');
      }
    }));

    link.classList.add('main-navigation__item--active');
  });
});

render(siteMainElement, createSiteSortTemplate(), 'beforeend');
render(siteMainElement, createFilmListTemplate(), 'beforeend');

const films = document.querySelector('.films');
const filmsList = document.querySelector('.films-list');
const filmsListContainer = films.querySelector('.films-list__container');

let countCard = 5;
let newCard = 5;

for (let i = 0; i < countCard; i++) {
  render(filmsListContainer, createFilmCardTemplate(dataCard[i]), 'beforeend');
}

const linkComment = document.querySelectorAll('.film-card__comments');

linkComment.forEach((link, i) => {
  link.addEventListener('click', () => {
    render(siteFooterElement, createPopupTemplate(dataCard[i]), 'afterend');
    const closePopup = document.querySelector('.film-details__close-btn');
    const popupDetails = document.querySelector('.film-details');
    closePopup.addEventListener('click', () => {
      popupDetails.style.display = 'none';
    });
  });
});

render(filmsList, createButtonMoreTemplate(), 'beforeend');
const buttonShowMore = document.querySelector('.films-list__show-more');

const renderCard = () => {
  const filmsItem = document.querySelectorAll('.film-card');
  countCard += 5;
  if (filmsItem.length >= dataCard.length) {
    buttonShowMore.style.display = 'none';
  }

  for (newCard; newCard < countCard; newCard++) {
    render(filmsListContainer, createFilmCardTemplate(dataCard[newCard]), 'beforeend');
  }
};

buttonShowMore.addEventListener('click', renderCard);

const titleExtra = [{ title: 'Top rated' }, { title: 'Most commented' }];
for (let i = 0; i < 2; i++) {
  render(films, createFilmListExtraTemplate(titleExtra[i]), 'beforeend');
}

const filmsListExtra = films.querySelectorAll('.films-list--extra');
if (filmsListExtra) {
  filmsListExtra.forEach((item) => {
    const filmsListContainerExtra = item.querySelector('.films-list__container');
    for (let i = 0; i < 2; i++) {
      render(filmsListContainerExtra, createFilmCardTemplate(dataCard[i]), 'beforeend');
    }
  });
}

const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createStatisticsTemplate(dataCard), 'beforeend');
