/**
 * @param {HTMLCanvasElement} canvas
 */
export const resetCanvas = (canvas) => {
  canvas.height = window.innerHeight;
  canvas.width = 200;
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

    if (t >= 0 && t <= 1 && u >= 0 && 0 <= 1) {
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        offset: t,
      };
    }
  }

  return null;
};
