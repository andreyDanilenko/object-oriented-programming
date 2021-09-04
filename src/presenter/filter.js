import NavView from "../view/site-nav";
import { RenderPosition, render, replace, remove } from "../utils/render";

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
  }

  init() {

  }

}
