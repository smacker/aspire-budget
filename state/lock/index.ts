import { app } from '../app/domain';

export const setEnabled = app.createEvent<boolean>();
export const tryUnlock = app.createEvent();

export const isAvailableFx = app.createEffect<void, boolean, Error>();
export const isEnabledFx = app.createEffect<void, boolean, Error>();
export const storeIsEnabledFx = app.createEffect<boolean, void, Error>();
export const tryUnlockFx = app.createEffect<void, boolean, Error>();

export const $isAvailable = app.createStore<boolean>(false);
export const $isEnabled = app.createStore<boolean>(false);
export const $isLocked = app.createStore<boolean>(false);
