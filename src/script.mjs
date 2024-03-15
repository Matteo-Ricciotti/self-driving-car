import Visualizer from './Visualizer.mjs';
import Car from './car.mjs';
import Road from './road.mjs';
import {
  discardBrain,
  generateCars,
  resetCarCanvas,
  resetNetworkCanvas,
  saveBrain,
} from './utils.mjs';

const PARALLELIZATION_CARS = 100;

/** @type {HTMLCanvasElement} */
const carCanvas = document.querySelector('#car-canvas');
/** @type {HTMLCanvasElement} */
const networkCanvas = document.querySelector('#network-canvas');

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

resetCarCanvas(carCanvas);
resetNetworkCanvas(networkCanvas);

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const cars = generateCars(road, PARALLELIZATION_CARS);
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 3)];

let bestCar = cars[0];
const bestBrain = localStorage.getItem('best-brain');

if (bestBrain) {
  bestCar.brain = JSON.parse(bestBrain);
}

/**
 * @param {number} time
 */
const loop = (time) => {
  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].update(road.borders, []);
  }

  for (const car of cars) {
    car.update(road.borders, traffic);
  }

  bestCar = cars.find((car) => car.y === Math.min(...cars.map((c) => c.y)));

  resetCarCanvas(carCanvas);
  resetNetworkCanvas(networkCanvas);

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].draw(carCtx, 'red');
  }

  carCtx.globalAlpha = 0.2;

  for (const car of cars) {
    car.draw(carCtx, 'blue');
  }

  carCtx.globalAlpha = 1;

  bestCar.draw(carCtx, 'black', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(loop);
};

document.querySelectorAll('button').forEach((button) =>
  button.addEventListener('click', (e) => {
    const id = 'id' in e.target ? e.target.id : null;

    if (id === 'save') {
      saveBrain(bestCar);
    }

    if (id === 'discard') {
      discardBrain();
    }
  }),
);

loop(0);
