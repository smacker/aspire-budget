import { app } from '../app/domain';

export const gSignIn = app.createEvent();
export const logout = app.createEvent();
export const refreshToken = app.createEvent();

export const initApiFx = app.createEffect<void, boolean, Error>();
export const gSignInFx = app.createEffect<void, boolean, Error>();
export const logoutFx = app.createEffect<void, void, Error>();

export const $isAuth = app.createStore<boolean>(false);
