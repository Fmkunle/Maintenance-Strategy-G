/**
 * Clamp a numeric value to the requested range.
 *
 * The risk engine depends heavily on probability values staying inside [0, 1].
 * Keeping one shared implementation avoids subtle drift between frontend logic,
 * backend logic, and test helpers.
 */
export const clampNumber = (value: number, min = 0, max = 1): number => {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

/**
 * Normalize potentially invalid numeric input to a safe non-negative number.
 */
export const asNonNegativeNumber = (value: number | null | undefined): number => {
  if (!Number.isFinite(value ?? NaN)) {
    return 0;
  }

  return Math.max(0, Number(value));
};
