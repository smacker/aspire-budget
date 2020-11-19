import { useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import useSecureStore from './useSecureStore';

const accessTokenKey = 'aspire-access-token';
const androidClientId = `***REMOVED***`;
const scopes = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
];

const statePending = 'pending';
const stateUnauthorized = 'unauthorized';
const stateAuthorized = 'authorized';

function useGoogleAuth() {
  const [status, setStatus] = useState(null);
  const [isTokenReady, token, setToken] = useSecureStore(accessTokenKey);

  useEffect(() => {
    if (!isTokenReady) {
      return;
    }

    if (token) {
      setStatus(stateAuthorized);
    } else {
      setStatus(stateUnauthorized);
    }
  }, [isTokenReady]);

  const login = async () => {
    setStatus(statePending);

    try {
      const resp = await Google.logInAsync({
        // iosClientId: `<YOUR_IOS_CLIENT_ID_FOR_EXPO>`,
        androidClientId,
        // iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
        // androidStandaloneAppClientId: `<YOUR_ANDROID_CLIENT_ID>`,
        //clientId: `595356817186-qfm5i61vmck9kisgf9jrhbtdnodebkt4.apps.googleusercontent.com`,
        scopes,
      });

      if (resp.type === 'success') {
        setToken(resp.accessToken);
        setStatus(stateAuthorized);
      } else {
        setStatus(stateUnauthorized);
      }
    } catch (e) {
      console.log('google log-in error', e);
      setStatus(stateUnauthorized);
    }
  };

  const logout = async () => {
    setStatus(stateUnauthorized);
    setToken(null);
  };

  return [status, token, login, logout];
}

export default useGoogleAuth;
