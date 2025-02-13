// Declare that __BUILD_FORMAT__ is a global constant defined by esbuild.
declare const __BUILD_FORMAT__: string;

/**
 * Asynchronously loads the default CSS styles.
 *
 * - In ESM builds (__BUILD_FORMAT__ === "esm"), it dynamically imports
 *   the module that uses import.meta.url.
 * - In IIFE builds, it falls back to using a relative URL.
 *
 * @returns {Promise<string>} A promise that resolves to the CSS text.
 */
export async function loadDefaultStyles(): Promise<string> {
  if (__BUILD_FORMAT__ === "esm") {
    // Dynamically import the ESM-specific module.
    const esmModule = await import("./esm-style.renderer.js");
    return esmModule.loadDefaultStylesEsm();
  } else {
    // For IIFE builds, use a relative URL.
    const cssUrl = "./default-styles.css";
    const response = await fetch(cssUrl);
    if (!response.ok) {
      throw new Error(`Failed to load default styles from ${cssUrl}`);
    }
    return await response.text();
  }
}
