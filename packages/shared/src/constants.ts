/**
 * Shared time-horizon constants used by both the browser app and the API.
 *
 * We keep these in a tiny shared package so the frontend, backend, and tests
 * all agree on the same model horizon without hard-coding the values in multiple
 * places.
 */
export const ANNUAL_HOURS = 8760;
export const STRATEGY_MODEL_HORIZON_YEARS = 10;
export const STRATEGY_MODEL_HORIZON_HOURS = ANNUAL_HOURS * STRATEGY_MODEL_HORIZON_YEARS;
