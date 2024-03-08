import Controls from './controls.mjs';

class Car {
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

    this.controls = new Controls();
  }

  /** @param  {CanvasRenderingContext2D} ctx */
  update = (ctx) => {
    this.#move();
    this.draw(ctx);
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
    const middleX = -this.width / 2;
    const middleY = -this.height / 2;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.fillRect(middleX, middleY, this.width, this.height);

    ctx.restore();
  };
}

export default Car;
