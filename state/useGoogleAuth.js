import { useState, useEffect, useCallback } from 'react';
import { ANDROID_CLIENT_ID, ANDROID_STANDALONE_CLIENT_ID } from '@env';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import useSecureStore from './useSecureStore';

const authKey = 'aspire-auth';
const scopes = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
];

const statePending = 'pending';
const stateUnauthorized = 'unauthorized';
const stateAuthorized = 'authorized';

function useGoogleAuth() {
  const [status, setStatus] = useState(null);
  const [isAuthDataReady, authData, setAuthData] = useSecureStore(
    authKey,
    true
  );

  useEffect(() => {
    if (!isAuthDataReady) {
      return;
    }

    if (!authData || !authData.accessToken) {
      setStatus(stateUnauthorized);
      return;
    }

    if (new Date().getTime() < authData.expiryTime) {
      setStatus(stateAuthorized);
      return;
    }

    refresh();
  }, [isAuthDataReady, authData, refresh]);

  const login = useCallback(async () => {
    setStatus(statePending);

    try {
      const resp = await Google.logInAsync({
        // iosClientId: `<YOUR_IOS_CLIENT_ID_FOR_EXPO>`,
        androidClientId: ANDROID_CLIENT_ID,
        // iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
        androidStandaloneAppClientId: ANDROID_STANDALONE_CLIENT_ID,
        scopes,
      });

      if (resp.type === 'success') {
        setAuthData({
          accessToken: resp.accessToken,
          refreshToken: resp.refreshToken,
          expiryTime: new Date().getTime() + 60 * 60 * 1000, // google tokens are valid for 1h
        });
        setStatus(stateAuthorized);
      } else {
        setStatus(stateUnauthorized);
      }
    } catch (e) {
      console.error('google log-in error', e);
      setStatus(stateUnauthorized);
    }
  }, [setStatus, setAuthData]);

  const logout = useCallback(async () => {
    setStatus(stateUnauthorized);
    setAuthData(null);
  }, [setStatus, setAuthData]);

  const refresh = useCallback(async () => {
    setStatus(statePending);

    const clientId =
      Constants.appOwnership === 'expo'
        ? ANDROID_CLIENT_ID
        : ANDROID_STANDALONE_CLIENT_ID;
    try {
      const resp = await fetch(
        `https://oauth2.googleapis.com/token?client_id=${clientId}&refresh_token=${authData.refreshToken}&grant_type=refresh_token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (resp.status !== 200) {
        console.error(`google refresh token status code ${resp.status}`);
        await logout();
        return;
      }

      const {
        access_token: accessToken,
        expires_in: expiryTime,
      } = await resp.json();
      setAuthData({
        ...authData,
        accessToken: accessToken,
        expiryTime: new Date().getTime() + expiryTime * 1000,
      });
      setStatus(stateAuthorized);
    } catch (e) {
      console.error('AUTH ERROR', e);
    }
  }, [authData, setAuthData, logout]);

  return [
    status,
    // return token only when the status is authorized
    status == stateAuthorized && authData && authData.accessToken,
    login,
    logout,
    refresh,
  ];
}

export default useGoogleAuth;
