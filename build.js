const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

/**
 * Copies a file from the source to the target location.
 *
 * @param {string} source - The source file path.
 * @param {string} target - The destination file path.
 */
function copyFile(source, target) {
  try {
    fs.copyFileSync(source, target);
    console.log(`Copied ${source} to ${target}`);
  } catch (error) {
    console.error(`Error copying ${source} to ${target}:`, error);
    process.exit(1);
  }
}

/**
 * Builds both the ESM and UMD bundles using esbuild.
 *
 * The ESM bundle is configured for code splitting and outputs multiple chunks,
 * while the UMD bundle is built as a single file.
 */
async function buildBundles() {
  console.log("Building bundles...");

  await Promise.all([
    // Build an ESM bundle with code splitting enabled.
    esbuild.build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      splitting: true, // Enable code splitting.
      sourcemap: true,
      minify: true, // Enable minification.
      target: ["esnext"], // Use a modern target for better tree shaking.
      outdir: "dist", // Use outdir so multiple output files can be generated.
      format: "esm",
      entryNames: "smartformio", // Rename the main entry file to smartformio.js.
      chunkNames: "[name]-[hash]", // Naming pattern for dynamic chunks.
      define: { __BUILD_FORMAT__: '"esm"' },
    }),
    // Build a UMD (IIFE) bundle.
    esbuild.build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ["esnext"],
      outfile: "dist/smartformio.umd.js",
      format: "iife",
      globalName: "SmartFormIO",
      define: { __BUILD_FORMAT__: '"iife"' },
    }),
  ]);

  console.log("Bundles built successfully.");
}

/**
 * Copies static assets (e.g., default-styles.css) from the themes directory into the dist folder.
 */
async function copyStaticAssets() {
  console.log("Copying static assets...");
  const sourcePath = path.join(__dirname, "themes", "default-styles.css");
  const targetPath = path.join(__dirname, "dist", "default-styles.css");
  copyFile(sourcePath, targetPath);
}

/**
 * The main function coordinating the build process.
 */
async function main() {
  await buildBundles();
  await copyStaticAssets();
  console.log("Build process completed successfully.");
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
