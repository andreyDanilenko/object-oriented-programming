import ProfileView from './view/header-profile';
import NavView from './view/site-nav';
import SortView from './view/films-sort';
import StatisticView from './view/statistics';
// import FilmsListExtraView from './view/films-list-extra';
import FilmsPresenter from './presenter/films';
import { cardData } from './mock/data-card';
import { generateFilter } from './utils/filters';

const filters = generateFilter(cardData);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

siteHeaderElement.appendChild(new ProfileView().getElement());
siteMainElement.appendChild(new NavView(filters).getElement());
siteMainElement.appendChild(new SortView().getElement());
const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(cardData);

// const films = document.querySelector('.films');
// const titleExtra = [{ title: 'Top rated' }, { title: 'Most commented' }];
// for (let i = 0; i < 2; i++) {
//   films.appendChild(new FilmsListExtraView(titleExtra[i]).getElement());
// }

// const filmsExtraList = films.querySelectorAll('.films-list--extra');
// const ratedFilms = cardData
//   .filter((card) => card.filmInfo.totalRating > 8)
//   .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
//   .slice(0, 2);
// ratedFilms.forEach((card) => {
//   const container = filmsExtraList[0].querySelector('.films-list__container');
//   renderFilmCard(container, card);
// });

// const mostComments = cardData
//   .slice()
//   .sort((a, b) => b.comments.length - a.comments.length)
//   .slice(0, 2);
// mostComments.forEach((card) => {
//   const container = filmsExtraList[1].querySelector('.films-list__container');
//   renderFilmCard(container, card);
// });

siteFooterStatisticsElement.appendChild(new StatisticView(cardData).getElement());
