import Car from './car.mjs';
import Road from './road.mjs';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 */
export const resetCanvas = (canvas, width) => {
  canvas.height = window.innerHeight;
  canvas.width = width;
};

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export const lerp = (a, b, t) => a + (b - a) * t;

// Segment Intersection https://www.youtube.com/watch?v=fHOLQJo0FjQ
/**
 * @param {any} a
 * @param {any} b
 * @param {any} c
 * @param {any} d
 */
export const getIntersection = (a, b, c, d) => {
  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        offset: t,
      };
    }
  }

  return null;
};

/**
 * @param {any} poly1
 * @param {any} poly2
 */
export const polysIntersect = (poly1, poly2) => {
  for (let i = 0; i < poly1.length; ++i) {
    for (let j = 0; j < poly2.length; ++j) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length],
      );

      if (touch) return true;
    }
  }

  return false;
};

/**
 * @param {number} value
 */
export const getRGBA = (value) => {
  const alpha = Math.abs(value);

  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;

  return 'rgba(' + R + ',' + G + ',' + B + ',' + alpha + ')';
};

/**
 * @param {Road} road
 * @param {number} n
 */
export const generateCars = (road, n) => {
  const cars = [];

  for (let i = 1; i <= n; ++i) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }

  return cars;
};

/**
 * @param {Road} road
 * @param {number} carsNumber
 */
export const generateTraffic = (road, carsNumber) => {
  /** @type {Car[]} */
  const traffic = [];

  /** @type {number[]} */
  const rows = [];

  let sum = 0;

  while (sum !== carsNumber) {
    let randomDensity = 0;

    while (randomDensity === 0 || sum + randomDensity > carsNumber) {
      randomDensity = Math.floor(Math.random() * road.lanes);
    }

    rows.push(randomDensity);

    sum = Math.min(sum + randomDensity, carsNumber);
  }

  for (let i = 0; i < rows.length; ++i) {
    /** @type {number[]} */
    const filledLanes = [];

    for (let j = 0; j < rows[i]; ++j) {
      let newCarLaneIndex;

      while (
        typeof newCarLaneIndex !== 'number' ||
        filledLanes.find((l) => l === newCarLaneIndex)
      ) {
        newCarLaneIndex = Math.floor(Math.random() * road.lanes);
      }

      filledLanes.push(newCarLaneIndex);

      const newCar = new Car(
        road.getLaneCenter(newCarLaneIndex),
        -250 * (i + 1),
        30,
        50,
        'DUMMY',
        3,
      );

      traffic.push(newCar);
    }
  }

  return traffic;
};

/**
 * @param {Car} car
 */
export const saveBrain = (car) => {
  localStorage.setItem('best-brain', JSON.stringify(car.brain));
};

export const discardBrain = () => {
  localStorage.removeItem('best-brain');
};
