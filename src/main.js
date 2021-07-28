import { createSiteNavTemplate } from './view/site-nav.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createSiteNavTemplate(), 'afterbegin');
