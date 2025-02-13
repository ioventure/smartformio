const esbuild = require("esbuild");

// Build both the ESM and UMD bundles using esbuild.
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
      outdir: "dist", // Output directory so multiple chunks can be generated.
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
 * Main function coordinating the build process.
 */
async function main() {
  await buildBundles();
  console.log("Build process completed successfully.");
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
