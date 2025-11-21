import { Mole } from './mole2.js';

export class Game {
  constructor({ boardEl, scoreEl, timeEl, missesEl }) {
    this.boardEl = boardEl;
    this.scoreEl = scoreEl;
    this.timeEl = timeEl;
    this.missesEl = missesEl;
    this.gridSize = 3;
    this.duration = 60;

    this.state = {
      score: 0,
      misses: 0,
      timeLeft: this.duration,
      running: false,
    };

    this._tickId = null;
    this._spawnId = null;
    this._activeMoles = new Set();

    this.handleBoardClick = this.handleBoardClick.bind(this);
  }

  init() {
    this.createGrid(this.gridSize);
    this.updateHud();
    this.boardEl.addEventListener('click', this.handleBoardClick);
    this.boardEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') this.handleBoardClick(e);
    });
  }

  createGrid(size = 3) {
    this.boardEl.innerHTML = '';
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.setAttribute('aria-label', `Hål ${i + 1}`);
      this.boardEl.appendChild(cell);
    }
  }

  start() {
    if (this.state.running) return;

    this.state.running = true;
    this.state.score = 0;
    this.state.misses = 0;
    this.state.timeLeft = this.duration;
    this.updateHud();

    this._tickId = setInterval(() => {
      this.state.timeLeft--;
      this.updateHud();
      if (this.state.timeLeft <= 0) this.end();
    }, 1000);

    const spawnLoop = () => {
      if (!this.state.running) return;
      this.spawnMole();
      const interval = Math.random() * 800 + 400;
      this._spawnId = setTimeout(spawnLoop, interval);
    };

    spawnLoop();
  }

  reset() {
    this.end();
    this.state.score = 0;
    this.state.misses = 0;
    this.state.timeLeft = this.duration;
    this.updateHud();
  }

  end() {
    this.state.running = false;
    clearInterval(this._tickId);
    clearTimeout(this._spawnId);
    this._activeMoles.forEach(m => m.disappear());
    this._activeMoles.clear();
    this.updateHud();
  }

  spawnMole() {
    const emptyCells = [...this.boardEl.querySelectorAll('.cell:not(.has-mole)')];
    if (emptyCells.length === 0) return;

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const mole = new Mole(cell, 900);
    this._activeMoles.add(mole);

    mole.appear(() => {
      this._activeMoles.delete(mole);
      this.state.misses++;
      this.updateHud();
    });
  }

  handleBoardClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell || !this.state.running) return;

    const mole = [...this._activeMoles].find(m => m.cellEl === cell);

    if (mole) {
      mole.disappear();
      this._activeMoles.delete(mole);
      this.state.score++;
    } else {
      this.state.misses++;
    }

    this.updateHud();
  }

  updateHud() {
    this.scoreEl.textContent = `Poäng: ${this.state.score}`;
    this.timeEl.textContent = `Tid: ${this.state.timeLeft}`;
    this.missesEl.textContent = `Missar: ${this.state.misses}`;
  }
}
