/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {App} from './src/base/components/App';
import {name as appName} from './app.json';
// Required to have the module loaded
import 'react-native-svg';

AppRegistry.registerComponent(appName, () => App);
