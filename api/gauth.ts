import * as Google from 'expo-google-app-auth';
import { AuthData, IGAuth } from './types';

export default class GoogleAuth implements IGAuth {
  private clientId: string;
  private scopes: string[];

  constructor(clientId: string, scopes: string[]) {
    this.clientId = clientId;
    this.scopes = scopes;
  }

  public async load(): Promise<AuthData> {
    throw 'not implemented';
  }

  public async login() {
    const resp = await Google.logInAsync({
      // iosClientId: `<YOUR_IOS_CLIENT_ID_FOR_EXPO>`,
      androidClientId: this.clientId,
      // iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
      androidStandaloneAppClientId: this.clientId,
      scopes: this.scopes,
    });
    if (resp.type === 'success') {
      return {
        accessToken: resp.accessToken,
        refreshToken: resp.refreshToken,
        expiryTime: new Date().getTime() + 60 * 60 * 1000, // google tokens are valid for 1h
      };
    } else {
      throw `incorrect response type '${resp.type}'`;
    }
  }

  public async logout(): Promise<void> {
    // do we really need to do anything here?
  }

  public async refresh(refreshToken: string) {
    const resp = await fetch(
      `https://oauth2.googleapis.com/token?client_id=${this.clientId}&refresh_token=${refreshToken}&grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (resp.status !== 200) {
      throw `google refresh token wrong status code ${resp.status}`;
    }

    const { access_token: accessToken, expires_in: expiryTime } =
      await resp.json();

    return {
      accessToken,
      refreshToken,
      expiryTime: new Date().getTime() + expiryTime * 1000,
    };
  }
}
