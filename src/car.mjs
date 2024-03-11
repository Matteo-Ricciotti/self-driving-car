import Controls from './controls.mjs';
import Sensor from './sensor.mjs';
import { polysIntersect } from './utils.mjs';

class Car {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;

    this.friction = 0.05;
    this.angle = 0;

    this.maxSpeed = 5;
    this.maxReverseSpeed = this.maxSpeed * 0.4;
    this.maxAngle = 0.5;

    this.damaged = false;

    this.sensors = new Sensor(this);
    this.controls = new Controls();
  }

  /**
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Array<Array<{}>>} roadBorders
   * */
  update = (ctx, roadBorders) => {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }

    this.sensors.update(roadBorders, ctx);
  };

  /**
   * @param  {Array<Array<{}>>} roadBorders
   * */
  #assessDamage = (roadBorders) => {
    for (const roadBorder of roadBorders) {
      if (polysIntersect(this.polygon, roadBorder)) return true;
    }
  };

  #createPolygon = () => {
    const points = [];

    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
  };

  #move = () => {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxReverseSpeed) this.speed = -this.maxReverseSpeed;

    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) this.angle += 0.03 * flip;
      if (this.controls.right) this.angle -= 0.03 * flip;
    }

    if (this.angle > this.maxAngle) this.angle = this.maxAngle;
    if (this.angle < -this.maxAngle) this.angle = -this.maxAngle;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  };

  /** @param {CanvasRenderingContext2D} ctx */
  draw = (ctx) => {
    if (this.damaged) {
      ctx.fillStyle = 'gray';
    } else {
      ctx.fillStyle = 'black';
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; ++i) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.fill();
  };
}

export default Car;
