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
