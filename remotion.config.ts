import { Config } from '@remotion/cli/config';

/**
 * Remotion Studio Configuration
 * Documentation: https://www.remotion.dev/docs/config
 *
 * Note: In Remotion 4.x, many settings are configured via CLI flags
 * or the Studio UI rather than this config file.
 */

// Output settings
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Studio port (3000 — Next.js runs on 3001, no conflict)
Config.setStudioPort(3000);

// Public directory for static assets
Config.setPublicDir('public');

// Webpack configuration
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': './src',
      },
    },
  };
});

// Default codec for rendering (can be overridden via CLI)
Config.setCodec('h264');

// Pixel format for maximum compatibility
Config.setPixelFormat('yuv420p');

// Concurrency for rendering (adjust based on your machine)
Config.setConcurrency(2);

// Chrome/Chromium flags for rendering stability
Config.setChromiumOpenGlRenderer('angle');
