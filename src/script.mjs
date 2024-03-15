import Visualizer from './Visualizer.mjs';
import Car from './car.mjs';
import Road from './road.mjs';
import { resetCarCanvas, resetNetworkCanvas } from './utils.mjs';

/** @type {HTMLCanvasElement} */
const carCanvas = document.querySelector('#car-canvas');
/** @type {HTMLCanvasElement} */
const networkCanvas = document.querySelector('#network-canvas');

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

resetCarCanvas(carCanvas);
resetNetworkCanvas(networkCanvas);

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 3)];

const loop = (time) => {
  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].update(carCtx, road.borders, []);
  }

  car.update(carCtx, road.borders, traffic);

  resetCarCanvas(carCanvas);
  resetNetworkCanvas(networkCanvas);

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].draw(carCtx, 'red');
  }

  car.draw(carCtx, 'blue');

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, car.brain);

  requestAnimationFrame(loop);
};

loop();
