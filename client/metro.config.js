const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const {sourceExts, assetExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resetCache: true,
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
    extraNodeModules: {
      'base': path.resolve(__dirname, './src/base'),
      'config': path.resolve(__dirname, './src/config'),
      'auth': path.resolve(__dirname, './src/auth'),
      'ui': path.resolve(__dirname, './src/ui'),
      'vpn': path.resolve(__dirname, './src/vpn'),
      'assets': path.resolve(__dirname, './assets'),
    }
  },
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [
    path.resolve(__dirname),
    path.resolve(__dirname, '../node_modules'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);