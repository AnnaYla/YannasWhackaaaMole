export class Mole {
  // this is the main class that handles all mole dynamic creation and disapperance
  constructor(cellEl, ttl = 900) {
    this.cellEl = cellEl;
    this.ttl = ttl;
    this._timeout = null;
    this._moleEl = null; // the actual mole DOM element
  }
  appear(onExpire) {
    // expire means the mole gone/disappear
    // Skapa en DOM-nod för mullvaden inuti cellen
    this._moleEl = document.createElement('span'); // created a span to
    this._moleEl.className = 'mole'; // use for styling maybe
    this.cellEl.appendChild(this._moleEl);
    this.cellEl.classList.add('has-mole'); // means the cell has mole

    // Försvinn efter ttl om ingen träff
    this._timeout = setTimeout(() => {
      this.disappear();
      if (typeof onExpire === 'function') onExpire();
    }, this.ttl);
  }
  // Anropas vid träff eller timeout
  disappear() {
    //stop timeout so it wont trigger again
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;
    // ? is called "optional chaining" allows access if a value exist
    // this line means if mole element exists and is still connected to the DOM, then remove it
    // isConnected built in proprty of all nodes, tells true or false
    if (this._moleEl?.isConnected) this._moleEl.remove();
    this.cellEl.classList.remove('has-mole');

    this._moleEl = null; // theis value exists but currently has no value
  }
  isVisible() { // just tells if the mole is currently shown
    return this.cellEl.classList.contains('has-mole');
  }
}
