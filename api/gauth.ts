import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Application from 'expo-application';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { EXPO_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
import { AuthData, IGAuth } from './types';

export const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
};

const minimumScopes = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// based on https://github.com/expo/expo/blob/56c60d4769f22a3fd80b5ae152d9453706e84a35/packages/expo-auth-session/src/providers/Google.ts
class GoogleAuthRequest extends AuthSession.AuthRequest {
  nonce?: string;

  constructor(config: AuthSession.AuthRequestConfig) {
    const scopes = [...new Set([...config.scopes, ...minimumScopes])];

    // PKCE must be disabled for implicit mode
    const isImplicit =
      config.responseType === AuthSession.ResponseType.Token ||
      config.responseType === AuthSession.ResponseType.IdToken;
    const usePKCE = isImplicit ? false : config.usePKCE;

    super({ ...config, scopes, usePKCE });
  }

  async getAuthRequestConfigAsync(): Promise<AuthSession.AuthRequestConfig> {
    const { extraParams = {}, ...config } =
      await super.getAuthRequestConfigAsync();
    if (
      config.responseType === AuthSession.ResponseType.IdToken &&
      !extraParams.nonce &&
      !this.nonce
    ) {
      if (!this.nonce) {
        this.nonce = await AuthSession.generateHexStringAsync(16);
      }
      extraParams.nonce = this.nonce;
    }

    return {
      ...config,
      extraParams,
    };
  }
}

export default class GoogleAuth implements IGAuth {
  private useProxy: boolean;
  private clientId: string;
  private scopes: string[];

  constructor(scopes: string[]) {
    this.useProxy =
      Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    this.clientId = this.useProxy
      ? EXPO_CLIENT_ID
      : Platform.select({
          //ios: 'iosClientId',
          android: ANDROID_CLIENT_ID,
          //default: 'webClientId',
        });
    this.scopes = scopes;
  }

  public async load(): Promise<AuthData> {
    throw 'not implemented';
  }

  public async login() {
    const redirectUri = AuthSession.makeRedirectUri({
      native: `${Application.applicationId}:/oauthredirect`,
      useProxy: this.useProxy,
    });
    const req = new GoogleAuthRequest({
      clientId: this.clientId,
      scopes: this.scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    });
    const resp = await req.promptAsync(discovery, { useProxy: this.useProxy });
    if (resp.type === 'success') {
      return {
        accessToken: resp.authentication.accessToken,
        refreshToken: resp.authentication.refreshToken,
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
