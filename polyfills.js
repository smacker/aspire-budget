import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  require('intl'); //eslint-disable-line
  require('intl/locale-data/jsonp/en'); //eslint-disable-line
}
