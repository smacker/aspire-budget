import { createGate } from 'effector-react';
import { combine } from 'effector';
import { app } from './domain';

import { $isAuth } from '../auth';
import { $spreadsheetId } from '../spreadsheet';

export const AppGate = createGate();

export const setVisible = app.createEvent<boolean>();

export const initFx = app.createEffect<void, boolean, Error>();
export const loadFontsFx = app.createEffect<void, void, Error>();

export const $isVisible = app.createStore<boolean>(true);
export const $isReady = app.createStore<boolean>(false);

export const $apiParams = combine(
  $isAuth,
  $spreadsheetId,
  (isAuth, spreadsheetId) => ({
    isAuth,
    spreadsheetId,
  })
);
export const $isApiReady = $apiParams.map(
  ({ isAuth, spreadsheetId }) => !!(isAuth && spreadsheetId)
);
