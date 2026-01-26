import { Config } from '@remotion/cli/config';

// Remotion Studio Configuration
// Full documentation: https://www.remotion.dev/docs/config

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Enable Studio features
Config.setStudioPort(3333);
Config.setPublicDir('public');

// Webpack configuration for better dev experience
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

// Codec settings
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
