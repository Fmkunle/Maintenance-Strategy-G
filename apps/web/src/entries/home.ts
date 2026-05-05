import "../../../../styles.css";

/**
 * Phase 1 web entry.
 *
 * We intentionally boot the current home-page script through Vite so we can start
 * layering product tooling and typed packages around the existing experience
 * before we redesign the UI shell.
 */
window.__welcomeAssetVersion = "product-web-home";
await import("../../../../app.js");
