import { defineConfig } from "vite";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "SmartForm",
      fileName: (format) => `smartformio.${format}.js`,
      formats: ["es", "umd"],
    },
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
      plugins: [
        typescript({
          useTsconfigDeclarationDir: true,
          clean: true,
        }),
        terser(),
      ],
    },
  },
});
