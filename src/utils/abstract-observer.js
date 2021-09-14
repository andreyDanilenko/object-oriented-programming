export default class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(event, payload) {
    console.log(event, payload, this._observers);
    this._observers.forEach((observer) => observer(event, payload));
  }
}
