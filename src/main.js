import { createSiteProfileTemplate } from './view/header-profile.js';
import { createSiteNavTemplate } from './view/site-nav.js';
import { createSiteSortTemplate } from './view/films-sort';
import { createFilmListTemplate } from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmListExtraTemplate } from './view/films-list-extra.js';
import { createButtonMoreTemplate } from './view/button-more.js';
import { createStatisticsTemplate } from './view/statistics.js';

import { createPopupTemplate } from './view/popup.js';
import { cardData } from './mock/data-card.js';
//import { dayjs } from 'dayjs';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, createSiteProfileTemplate(), 'beforeend');
render(siteMainElement, createSiteNavTemplate(cardData), 'beforeend');

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
const filmsList = document.querySelector('.films-list');
const filmsListContainer = films.querySelector('.films-list__container');

let cardCount = 5;
let newCard = 5;

for (let i = 0; i < cardCount; i++) {
  render(filmsListContainer, createFilmCardTemplate(cardData[i]), 'beforeend');
}

const linkComment = document.querySelectorAll('.film-card__comments');

linkComment.forEach((link, i) => {
  link.addEventListener('click', () => {
    render(siteFooterElement, createPopupTemplate(cardData[i]), 'afterend');
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
  cardCount += 5;
  // eslint-disable-next-line no-console
  console.log(filmsItem);
  if (filmsItem.length >= cardData.length) {
    buttonShowMore.style.display = 'none';
  }

  if (cardData.length - (filmsItem.length - 4) >= 5) {
    for (newCard; newCard < cardCount; newCard++) {
      render(filmsListContainer, createFilmCardTemplate(cardData[newCard]), 'beforeend');
    }
  } else {
    for (newCard = (filmsItem.length - 4); newCard < cardData.length; newCard++) {
      render(filmsListContainer, createFilmCardTemplate(cardData[newCard]), 'beforeend');
    }
  }

  const linkCommentNew = document.querySelectorAll('.film-card__comments');

  linkCommentNew.forEach((link, i) => {
    link.addEventListener('click', () => {
      render(siteFooterElement, createPopupTemplate(cardData[i]), 'afterend');
      const closePopup = document.querySelector('.film-details__close-btn');
      const popupDetails = document.querySelector('.film-details');
      closePopup.addEventListener('click', () => {
        popupDetails.style.display = 'none';
      });
    });
  });
};

buttonShowMore.addEventListener('click', renderCard);

const titleExtra = [{ title: 'Top rated' }, { title: 'Most commented' }];
for (let i = 0; i < 2; i++) {
  render(films, createFilmListExtraTemplate(titleExtra[i]), 'beforeend');
}

const filmsExtra = document.querySelector('.films');
const filmsListExtra = filmsExtra.querySelectorAll('.films-list--extra');
//const filmsTitleExtra = filmsListExtra.querySelector('.films-list__title');

filmsListExtra.forEach((item) => {
  const filmsListContainerExtra = item.querySelector('.films-list__container');
  for (let i = 0; i < 2; i++) {
    render(filmsListContainerExtra, createFilmCardTemplate(cardData[i]), 'beforeend');
  }
});

const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createStatisticsTemplate(cardData), 'beforeend');
