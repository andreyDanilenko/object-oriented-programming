import AbstractView from './abstract';
import { getUserRank } from '../utils/utils';

const createSiteProfileTemplate = (rank) => `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(rank)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class Profile extends AbstractView {
  constructor(rank) {
    super();
    this._rank = rank;
  }

  getTemplate() {
    return createSiteProfileTemplate(this._rank);
  }
}

