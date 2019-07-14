/**
 * @format
 */

import { AppRegistry, Platform, PermissionsAndroid } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (Platform.OS === 'android') {
  (async () => {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: 'Record Audio Permission',
      message: 'Record Audio Permission',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  })();
}

AppRegistry.registerComponent(appName, () => App);
