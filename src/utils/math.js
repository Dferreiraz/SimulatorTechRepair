/** Limita `value` ao intervalo [min, max]. */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
