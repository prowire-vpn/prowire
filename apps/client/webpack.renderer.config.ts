import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';
import type {Configuration} from 'webpack';

import {plugins} from './webpack.plugins';
import {rules} from './webpack.rules';

rules.push({
  test: /\.css$/,
  use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
});

rules.push({
  test: /\.svg$/,
  use: ['@svgr/webpack'],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    plugins: [new TsconfigPathsPlugin()],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  devtool: 'source-map',
};
