import GSheetsAps from './gsheets';

import Constants from 'expo-constants';
import { ANDROID_CLIENT_ID, ANDROID_STANDALONE_CLIENT_ID } from '@env';

const clientId =
  Constants.appOwnership === 'expo'
    ? ANDROID_CLIENT_ID
    : ANDROID_STANDALONE_CLIENT_ID;

export default new GSheetsAps(clientId);
