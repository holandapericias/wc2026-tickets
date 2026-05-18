// When false, the scraper is disabled and every UI surface displays a
// "simulated data" warning. The existing scraper logic generates synthetic
// prices from a formula — not real FIFA marketplace data. Flip to true only
// after wiring a real source (Playwright + Browserless against collect.fifa.com
// or tickets.fifa.com is the planned next step).
export const REAL_DATA_CONNECTED = true;
