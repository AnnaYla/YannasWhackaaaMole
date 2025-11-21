export class Mole {
  constructor(cellEl, ttl = 900) {
    this.cellEl = cellEl;
    this.ttl = ttl;
    this._timeout = null;
    this._root = null;
  }

  appear(onExpire) {
    this._root = document.createElement('span');
    this._root.className = 'mole';
    this.cellEl.appendChild(this._root);
    this.cellEl.classList.add('has-mole');

    this._timeout = setTimeout(() => {
      this.disappear();
      if (typeof onExpire === 'function') onExpire();
    }, this.ttl);
  }

  disappear() {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;
    if (this._root?.isConnected) this._root.remove();
    this.cellEl.classList.remove('has-mole');
    this._root = null;
  }
}
