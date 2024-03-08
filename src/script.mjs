import Car from './car.mjs';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const car = new Car(100, 100, 30, 50);

const resetCanvas = () => {
  canvas.height = window.innerHeight;
  canvas.width = 200;
};

const loop = () => {
  resetCanvas();

  car.update(ctx);

  requestAnimationFrame(loop);
};

loop();
