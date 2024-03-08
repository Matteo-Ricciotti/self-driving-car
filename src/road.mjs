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

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1_000_000;

    this.top = infinity;
    this.bottom = -infinity;
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

    for (let i = 0; i <= this.lanes; ++i) {
      const x = lerp(this.left, this.right, i / this.lanes);

      if (i > 0 && i < this.lanes) {
        ctx.setLineDash([20, 20]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  };
}

export default Road;
