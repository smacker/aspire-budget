import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { ANDROID_CLIENT_ID, ANDROID_STANDALONE_CLIENT_ID } from '@env';
import * as Google from 'expo-google-app-auth';
import { forward } from 'effector';
import {
  gSignIn,
  logout,
  loadAuthDataFx,
  gSignInFx,
  logoutFx,
  $authData,
} from '.';
import { AuthData } from '../../types';

const authKey = 'aspire-auth';
const scopes = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
];

const refresh = async ({ refreshToken }) => {
  const clientId =
    Constants.appOwnership === 'expo'
      ? ANDROID_CLIENT_ID
      : ANDROID_STANDALONE_CLIENT_ID;

  const resp = await fetch(
    `https://oauth2.googleapis.com/token?client_id=${clientId}&refresh_token=${refreshToken}&grant_type=refresh_token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (resp.status !== 200) {
    console.error(`google refresh token status code ${resp.status}`);
    throw 'wrong status code';
  }

  const { access_token: accessToken, expires_in: expiryTime } =
    await resp.json();

  const authData = {
    accessToken,
    refreshToken,
    expiryTime: new Date().getTime() + expiryTime * 1000,
  };

  await SecureStore.setItemAsync(authKey, JSON.stringify(authData));

  return authData;
};

const verify = async (authData: AuthData) => {
  if (new Date().getTime() >= authData.expiryTime) {
    return refresh(authData);
  }

  // should I check for revoked token too?
  return authData;
};

// effects

loadAuthDataFx.use(async () => {
  let storedValue = await SecureStore.getItemAsync(authKey);
  if (!storedValue) {
    throw 'no saved data';
  }

  return verify(JSON.parse(storedValue));
});

gSignInFx.use(async () => {
  const resp = await Google.logInAsync({
    // iosClientId: `<YOUR_IOS_CLIENT_ID_FOR_EXPO>`,
    androidClientId: ANDROID_CLIENT_ID,
    // iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
    androidStandaloneAppClientId: ANDROID_STANDALONE_CLIENT_ID,
    scopes,
  });
  if (resp.type === 'success') {
    const authData = {
      accessToken: resp.accessToken,
      refreshToken: resp.refreshToken,
      expiryTime: new Date().getTime() + 60 * 60 * 1000, // google tokens are valid for 1h
    };

    await SecureStore.setItemAsync(authKey, JSON.stringify(authData));

    return authData;
  } else {
    throw `incorrect response type '${resp.type}'`;
  }
});

logoutFx.use(async () => {
  await SecureStore.deleteItemAsync(authKey);
});

// store

$authData
  .reset(logoutFx)
  .on([loadAuthDataFx.doneData, gSignInFx.doneData], (_, data) => data);

// links

forward({
  from: gSignIn,
  to: gSignInFx,
});

forward({
  from: logout,
  to: logoutFx,
});
