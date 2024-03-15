/**
 * @param {HTMLCanvasElement} canvas
 */
export const resetCarCanvas = (canvas) => {
  canvas.height = window.innerHeight;
  canvas.width = 200;
};

/**
 * @param {HTMLCanvasElement} canvas
 */
export const resetNetworkCanvas = (canvas) => {
  canvas.height = window.innerHeight;
  canvas.width = 300;
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
