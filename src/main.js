import ProfileView from './view/header-profile';
import NavView from './view/site-nav';
import StatisticView from './view/statistics';
import FilmsPresenter from './presenter/films';
import FilterPresenter from './presenter/filter';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import { cardData } from './mock/data-card';
import { generateFilter } from './utils/filters';
import { render, RenderPosition } from './utils/render';

const filters = generateFilter(cardData);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
filmsModel.setFilms(cardData);

const filterModel = new FilterModel();

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavView(filters), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);

filterPresenter.init();
filmsPresenter.init();

render(siteFooterStatisticsElement, new StatisticView(cardData), RenderPosition.BEFOREEND);
