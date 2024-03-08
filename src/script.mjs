import Car from './car.mjs';
import Road from './road.mjs';
import { resetCanvas } from './utils.mjs';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

resetCanvas(canvas);

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

const loop = () => {
  resetCanvas(canvas);

  road.draw(ctx);
  car.update(ctx);

  requestAnimationFrame(loop);
};

loop();
