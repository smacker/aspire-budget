import { createGate } from 'effector-react';
import { combine } from 'effector';

import { $isAuth } from '../auth';
import { $spreadsheetId } from '../spreadsheet';

export const AppGate = createGate();

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
