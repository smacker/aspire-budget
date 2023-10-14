import * as Application from 'expo-application';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { ANDROID_CLIENT_ID } from '@env';
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
  private clientId: string;
  private clientSecret: string;
  private scopes: string[];

  constructor(scopes: string[]) {
    this.clientId = Platform.select({
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
    });
    // "refreshToken" is available only for responseType=code flow
    const req = new GoogleAuthRequest({
      clientId: this.clientId,
      scopes: this.scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      // mandatory to receive refreshToken in the response
      prompt: AuthSession.Prompt.Consent,
      extraParams: {
        // mandatory to receive refreshToken in the response
        access_type: 'offline',
      },
    });
    const resp = await req.promptAsync(discovery);
    if (resp.type === 'success') {
      const now = new Date().getTime();
      const exchangeRequest = new AuthSession.AccessTokenRequest({
        clientId: this.clientId,
        // mandatory for refreshToken
        clientSecret: this.clientSecret,
        redirectUri,
        scopes: this.scopes,
        code: resp.params.code,
        extraParams: {
          code_verifier: req.codeVerifier || '',
        },
      });
      const authentication = await exchangeRequest.performAsync(discovery);

      return {
        accessToken: authentication.accessToken,
        refreshToken: authentication.refreshToken,
        expiryTime: now + authentication.expiresIn * 1000,
      };
    } else {
      throw `incorrect response type '${resp.type}'`;
    }
  }

  public async logout(): Promise<void> {
    // do we really need to do anything here?
  }

  public async refresh(refreshToken: string) {
    const now = new Date().getTime();
    const req = new AuthSession.RefreshTokenRequest({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      refreshToken,
    });
    const resp = await req.performAsync(discovery);

    return {
      accessToken: resp.accessToken,
      refreshToken,
      expiryTime: now + resp.expiresIn * 1000,
    };
  }
}
