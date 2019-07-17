/**
 * @format
 */

import { AppRegistry, Platform, PermissionsAndroid, AppState } from 'react-native';
import axios from 'axios';

import App from './App';
import { name as appName } from './app.json';
import { SPEECH_API_BASE_URL } from './env';

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

AppState.addEventListener('change', (nextState) => {
  if (nextState === 'active') {
    warmUp();
  }
});

function warmUp() {
  const url = SPEECH_API_BASE_URL.replace('wss://', 'https://');
  axios.get(url);
}
warmUp();

AppRegistry.registerComponent(appName, () => App);
