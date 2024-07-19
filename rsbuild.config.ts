import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

export default defineConfig({
    tools: {
        rspack(config, { appendPlugins }) {
          // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
          if (process.env.RSDOCTOR) {
            appendPlugins(
              new RsdoctorRspackPlugin({
                // plugin options
              }),
            );
          }
        },
      },
});
