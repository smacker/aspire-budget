import { app } from '../app/domain';

const defaultAuth = {
  accessToken: null,
  refreshToken: null,
  expiryTime: null,
};

export const gSignIn = app.createEvent();
export const logout = app.createEvent();

export const loadAuthDataFx = app.createEffect();
export const gSignInFx = app.createEffect();
export const logoutFx = app.createEffect();

export const $authData = app.createStore(defaultAuth);
export const $token = $authData.map(({ accessToken }) => accessToken);
export const $isAuth = $token.map((v) => !!v);
