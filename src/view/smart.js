import AbstractView from '../abstract/component';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  // Метод обновляющий данные
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    if (justDataUpdating) {
      return;
    }

    this._data = { ...this._data, ...update };

    this.updateElement();
  }

  // Метод пересоздающий элемент с новыми данными
  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
