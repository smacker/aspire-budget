import { app } from '../app/domain';
import { AuthData } from '../../types';

const defaultAuth = {
  accessToken: '',
  refreshToken: '',
  expiryTime: 0,
};

export const gSignIn = app.createEvent();
export const logout = app.createEvent();
export const refreshToken = app.createEvent();

export const loadAuthDataFx = app.createEffect<void, AuthData, Error>();
export const gSignInFx = app.createEffect<void, AuthData, Error>();
export const logoutFx = app.createEffect<void, void, Error>();

export const $authData = app.createStore<AuthData>(defaultAuth);
export const $token = $authData.map(({ accessToken }) => accessToken);
export const $isAuth = $token.map((v) => !!v);
