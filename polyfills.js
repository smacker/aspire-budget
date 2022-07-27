import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  /* eslint-disable */
  require('intl');
  // Including all the locales causes too large build that expo can't process
  // load only english US & GB for now
  require('intl/locale-data/jsonp/en');
  require('intl/locale-data/jsonp/en-GB');
  require('intl/locale-data/jsonp/en-US');
  // probably we will need to download other locales from the internet
  // based on the value of locale in spreadsheet and cache it
}
