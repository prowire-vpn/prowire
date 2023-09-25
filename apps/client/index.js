/**
 * @format
 */

import {AppRegistry, Linking} from 'react-native';
import {App} from './src/base/components/App';
import {name as appName} from './app.json';
// Required to have the module loaded
import 'react-native-svg';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

AppRegistry.registerComponent(appName, () => App);
