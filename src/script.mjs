import Car from './car.mjs';
import Road from './road.mjs';
import { resetCanvas } from './utils.mjs';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

resetCanvas(canvas);

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'KEYS');
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 3)];

const loop = () => {
  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].update(ctx, road.borders, []);
  }

  car.update(ctx, road.borders, traffic);

  resetCanvas(canvas);

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);

  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].draw(ctx, 'red');
  }

  car.draw(ctx, 'blue');

  ctx.restore();

  requestAnimationFrame(loop);
};

loop();
