import { Mole } from './mole.js';

export class Game {
  constructor({ boardEl, scoreEl, timeEl, missesEl }) {
    this.boardEl = boardEl;
    this.scoreEl = scoreEl;
    this.timeEl = timeEl;
    this.missesEl = missesEl;

    this.gridSize = 3;
    this.duration = 10; //seconds
    this.state = {
      score: 0,
      misses: 0,
      timeLeft: this.duration,
      running: false,
    };

    this._countdownTimer = null; // stores coundown timer ID
    this._spawnTimer = null; // stores mole spawn timer ID
    this._activeMoles = new Set(); // keep tracks of moles active
    // bind --> points always to current game object or instance
    this.handleBoardClick = this.handleBoardClick.bind(this); // ensures click handler always know which game belongs to
  }

  init() {
    this.createGrid(this.gridSize);
    this.updateBoardInfo(); //BoardInfo -> heads up display example score, timer

    //

    this.boardEl.addEventListener('click', this.handleBoardClick);
    this.boardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === '') {
        //intentional error was placed here no {}
        this.handleBoardClick(e);
      }
    });
  }

  createGrid(size = 3) {
    this.boardEl.innerHTML = '';
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.setAttribute('aria-label', `hole ${i + 1}`);
      this.boardEl.appendChild(cell);
    }
  }

  start() {
    if (this.state.running) return;

    this.state.running = true;
    this.state.score = 0;
    this.state.misses = 0;
    this.state.timeLeft = this.duration;
    this.updateBoardInfo();

    //time counter set every minute
    this._countdownTimer = setInterval(() => {
      this.state.timeLeft--;
      this.updateBoardInfo();

      if (this.state.timeLeft <= 0) {
        this.stop();
      }
    }, 1000);

    // set when the moles will showup on the hole

    const spawnLoop = () => {
      if (!this.state.running) return; // when game is not running, stop the spaning of moles

      const stayTime = Math.random() * 1000 + 500; // mole is visible
      this.spawnMole(stayTime);

      const nextSpawn = Math.random() * 1000 + 500;
      this._spawnTimer = setTimeout(spawnLoop, nextSpawn);
    };

    spawnLoop(); // starts the loop
  }

  stop() {
    this.state.running = false;
    this._clearCountdown();
    this._clearSpawn();
  }

  reset() {
    //clean up the display board, loop through _activeMoles

    //stop timer

    this._clearCountdown();
    this._clearSpawn();

    //hide all active moles and clear the set

    this._activeMoles.forEach((mole) => mole.hide());
    this._activeMoles.clear();

    //reset state

    this.state.score = 0;
    this.state.misses = 0;
    this.state.timeLeft = this.duration;
    this.state.running = false;

    //this is the helper method
    this.updateBoardInfo();
  }
  // Helper method to clear timers
  _clearCountdown() {
    if (this._countdownTimer !== null) {
      clearInterval(this._countdownTimer); // works for setInterval or setTimeout
      this._countdownTimer = null;
    }
  }

  _clearSpawn() {
    if (this._spawnTimer !== null) {
      clearTimeout(this._spawnTimer);
      this._spawnTimer = null;
    }
  }

  spawnMole(stayTime = 800) {
    // TODO: välj slumpmässig tom cell och mounta en ny Mole

    const emptyCells = [
      ...this.boardEl.querySelectorAll('.cell:not(.has-mole)'),
    ];
    if (emptyCells.length === 0) return;

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const mole = new Mole(cell, stayTime);

    this._activeMoles.add(mole);
    mole.appear(() => {
      this._activeMoles.delete(mole);
      this.state.misses++;
      this.updateBoardInfo();
    });
  }
  handleBoardClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell || !this.state.running) return;

    const mole = [...this._activeMoles].find((m) => m.cellEl === cell);
    console.log(mole);

    if (!mole) {
      this.state.misses++;
    } else {
      this.state.score++;
      mole.disappear();
      this._activeMoles.delete(mole);
    }
    this.updateBoardInfo();
  }

  updateBoardInfo() {
    this.scoreEl.textContent = `points: ${this.state.score}`;
    this.timeEl.textContent = `time: ${this.state.timeLeft}`;
    this.missesEl.textContent = `missed: ${this.state.misses}`;
  }
}
