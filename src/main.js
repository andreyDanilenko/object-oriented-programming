import { createSiteProfileTemplate } from './view/site-header-profile.js';
import { createSiteNavTemplate } from './view/site-nav.js';
import { createSiteSortTemplate } from './view/site-sort';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createSiteProfileTemplate(), 'beforeend');

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createSiteNavTemplate(), 'afterbegin');
render(siteMainElement, createSiteSortTemplate(), 'beforeend');


const siteFooterElement = document.querySelector('.footer');
