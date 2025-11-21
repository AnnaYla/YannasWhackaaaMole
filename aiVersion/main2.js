import { Game } from './game2.js';

const ui = {
  boardEl: document.querySelector('#board'),
  scoreEl: document.querySelector('#score'),
  timeEl: document.querySelector('#time'),
  missesEl: document.querySelector('#misses'),
  startBtn: document.querySelector('#startBtn'),
  resetBtn: document.querySelector('#resetBtn'),
};

const game = new Game(ui);
game.init();

ui.startBtn.addEventListener('click', () => game.start());
ui.resetBtn.addEventListener('click', () => game.reset());
