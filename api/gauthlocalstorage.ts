import * as SecureStore from 'expo-secure-store';
import GoogleAuth from './gauth';
import { AuthData, IGAuth } from './types';

const authKey = 'aspire-auth';

export default class GoogleAuthLocalStorage
  extends GoogleAuth
  implements IGAuth
{
  public async load(): Promise<AuthData> {
    let storedValue = await SecureStore.getItemAsync(authKey);
    if (!storedValue) {
      throw 'no saved data';
    }

    return JSON.parse(storedValue);
  }

  public async login(): Promise<AuthData> {
    const authData = await super.login();
    await SecureStore.setItemAsync(authKey, JSON.stringify(authData));

    return authData;
  }

  public async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(authKey);
  }

  public async refresh(refreshToken: string): Promise<AuthData> {
    const authData = await super.refresh(refreshToken);
    await SecureStore.setItemAsync(authKey, JSON.stringify(authData));

    return authData;
  }
}
