import { createSiteNavTemplate } from './view/site-nav.js';
import { createSiteSortTemplate } from './view/site-sort';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteMainElement, createSiteNavTemplate(), 'afterbegin');
render(siteMainElement, createSiteSortTemplate(), 'beforeend');
