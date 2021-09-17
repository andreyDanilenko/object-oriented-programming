import MoviesInsideView from './view/inside';
import FilmsPresenter from './presenter/films';
import FilterPresenter from './presenter/filter';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import { api } from './api.js';
import { UpdateType } from './utils/const';
import { render, RenderPosition } from './utils/render';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, siteHeaderElement, filmsModel, filterModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel);

filmsPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    filterPresenter.init();
    render(siteFooterStatisticsElement, new MoviesInsideView(films), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
