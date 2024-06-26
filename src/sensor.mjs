import Car from './car.mjs';
import { getIntersection, lerp } from './utils.mjs';

class Sensor {
  /** @param {Car} car */
  constructor(car) {
    this.car = car;

    this.rayCount = 6;
    this.rayLength = 180;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  /**
   * @param  {Array<Array<{}>>} roadBorders
   * @param  {Array<Car>} traffic
   * */
  update = (roadBorders, traffic) => {
    this.#castRays();
    this.readings = [];

    for (const ray of this.rays) {
      this.readings.push(this.#getReading(ray, roadBorders, traffic));
    }
  };

  /**
   * @param  {Array<{}>} ray
   * @param  {Array<Array<{}>>} roadBorders
   * @param  {Array<Car>} traffic
   * */
  #getReading = (ray, roadBorders, traffic) => {
    const touches = [];

    for (const roadBorder of roadBorders) {
      const touch = getIntersection(ray[0], ray[1], roadBorder[0], roadBorder[1]);

      if (touch) touches.push(touch);
    }

    for (const car of traffic) {
      const poly = car.polygon;
      for (let i = 0; i < poly.length; ++i) {
        const value = getIntersection(ray[0], ray[1], poly[i], poly[(i + 1) % poly.length]);
        if (value) {
          touches.push(value);
        }
      }
    }

    if (!touches.length) return null;

    const offsets = touches.map((t) => t.offset);
    const minOffset = Math.min(...offsets);

    return touches.find((t) => t.offset === minOffset);
  };

  #castRays = () => {
    this.rays = [];

    for (let i = 0; i < this.rayCount; ++i) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1),
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  };

  /** @param {CanvasRenderingContext2D} ctx */
  draw = (ctx) => {
    for (let i = 0; i < this.rayCount; ++i) {
      let end = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  };
}

export default Sensor;
