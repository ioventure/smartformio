/**
 * Loads the default CSS styles using import.meta.url.
 * This function is only used in ESM builds.
 */
export async function loadDefaultStylesEsm(): Promise<string> {
  // Construct the URL relative to this module.
  const cssUrl = new URL("./default-styles.css", import.meta.url).href;
  const response = await fetch(cssUrl);
  if (!response.ok) {
    throw new Error(`Failed to load default styles from ${cssUrl}`);
  }
  return await response.text();
}
