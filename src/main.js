import ProfileView from './view/header-profile';
import MoviesInsideView from './view/inside';
import FilmsPresenter from './presenter/films';
import FilterPresenter from './presenter/filter';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import Api from './api.js';
import { cardData } from './mock/data-card';
import { render, RenderPosition } from './utils/render';

const AUTHORIZATION = 'Basic df09gdf00df9g0df9g';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((films) => {
  console.log(films);
});


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
filmsModel.setFilms(cardData);

const filterModel = new FilterModel();

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel);

filterPresenter.init();
filmsPresenter.init();

render(siteFooterStatisticsElement, new MoviesInsideView(filmsModel.getFilms()), RenderPosition.BEFOREEND);

