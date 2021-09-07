import ProfileView from './view/header-profile';
import MoviesInsideView from './view/inside';
import FilmsPresenter from './presenter/films';
import FilterPresenter from './presenter/filter';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import Api from './api.js';
import { UpdateType } from './utils/const';
import { render, RenderPosition } from './utils/render';

const AUTHORIZATION = 'Basic df09gdf00df9g0df9g';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel, api);

filmsPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
    filterPresenter.init();
    render(siteFooterStatisticsElement, new MoviesInsideView(films), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
