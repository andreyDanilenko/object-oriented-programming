import ProfileView from './view/header-profile';
import NavView from './view/site-nav';
import SortView from './view/films-sort';
import FilmsListView from './view/films-list';
import FilmCardView from './view/film-card';
import FilmsListExtraView from './view/films-list-extra';
import LoadMoreButtonView from './view/button-more';
import StatisticView from './view/statistics';
import PopupCardView from './view/popup';
import FilmNoCardView from './view/film-no-card';

import { RATED_COUNT, FILM_COUNT_PER_STEP } from './utils/const';
import { cardData } from './mock/data-card';
import { generateFilter } from './utils/filters';

const filters = generateFilter(cardData);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderFilmCard = (container, data) => {
  const filmCardComponent = new FilmCardView(data);
  const popupCardComponent = new PopupCardView(data);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      document.querySelector('.film-details').remove();
      document.removeEventListener('keydown', onEscKeyDown);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  const openPopupCard = () => {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    siteFooterElement.appendChild(popupCardComponent.getElement());
    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  };

  const filmCard = filmCardComponent.getElement();

  filmCard.querySelector('.film-card__poster').addEventListener('click', () => {
    openPopupCard();
  });

  filmCard.querySelector('.film-card__comments').addEventListener('click', () => {
    openPopupCard();
  });

  filmCard.querySelector('.film-card__title').addEventListener('click', () => {
    openPopupCard();
  });

  popupCardComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    document.querySelector('.film-details').remove();
    document.removeEventListener('keydown', onEscKeyDown);
    document.querySelector('body').classList.remove('hide-overflow');
  });

  container.appendChild(filmCardComponent.getElement());
};

const renderFilmsList = (listContainer, data) => {
  listContainer.appendChild(new FilmsListView().getElement());
  const films = document.querySelector('.films');
  const filmsList = films.querySelector('.films-list');
  const filmsListContainer = films.querySelector('.films-list__container');

  if (data.length === 0) {
    filmsList.appendChild(new FilmNoCardView().getElement());
    return;
  }

  for (let i = 0; i < Math.min(data.length, FILM_COUNT_PER_STEP); i++) {
    renderFilmCard(filmsListContainer, data[i]);
  }

  const titleExtra = [{ title: 'Top rated' }, { title: 'Most commented' }];
  for (let i = 0; i < 2; i++) {
    films.appendChild(new FilmsListExtraView(titleExtra[i]).getElement());
  }

  const filmsExtraList = films.querySelectorAll('.films-list--extra');
  const ratedFilms = data
    .filter((card) => card.filmInfo.totalRating > RATED_COUNT)
    .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
    .slice(0, 2);
  ratedFilms.forEach((card) => {
    const container = filmsExtraList[0].querySelector('.films-list__container');
    renderFilmCard(container, card);
  });

  const mostComments = data
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 2);
  mostComments.forEach((card) => {
    const container = filmsExtraList[1].querySelector('.films-list__container');
    renderFilmCard(container, card);
  });

  if (data.length > FILM_COUNT_PER_STEP) {
    let renderedTaskCount = FILM_COUNT_PER_STEP;

    filmsList.appendChild(new LoadMoreButtonView().getElement());

    const loadMoreButton = document.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      data.slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
        .forEach((card) => {
          renderFilmCard(filmsListContainer, card);
        });
      renderedTaskCount += FILM_COUNT_PER_STEP;

      if (renderedTaskCount >= cardData.length) {
        loadMoreButton.remove();
      }
    });
  }
};

siteHeaderElement.appendChild(new ProfileView().getElement());
siteMainElement.appendChild(new NavView(filters).getElement());
siteMainElement.appendChild(new SortView().getElement());
renderFilmsList(siteMainElement, cardData);
siteFooterStatisticsElement.appendChild(new StatisticView(cardData).getElement());
