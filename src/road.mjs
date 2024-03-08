import { lerp } from './utils.mjs';

class Road {
  /**
   * @param {number} x
   * @param {number} width
   * @param {number} [lanes]
   */
  constructor(x, width, lanes = 3) {
    this.x = x;
    this.width = width;
    this.lanes = lanes;

    const infinity = 1_000_000;

    this.left = x - width / 2;
    this.right = x + width / 2;
    this.top = infinity;
    this.bottom = -infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  /** @param {number} laneIndex */
  getLaneCenter = (laneIndex) => {
    const laneWidth = this.width / this.lanes;
    return this.left + laneWidth / 2 + Math.min(Math.max(laneIndex, 0), this.lanes - 1) * laneWidth;
  };

  /** @param {CanvasRenderingContext2D} ctx */
  draw = (ctx) => {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';

    for (let i = 1; i <= this.lanes - 1; ++i) {
      const x = lerp(this.left, this.right, i / this.lanes);

      ctx.beginPath();
      ctx.setLineDash([20, 20]);
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  };
}

export default Road;
