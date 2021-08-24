import { createGate } from 'effector-react';
import { combine } from 'effector';

import { $token } from '../auth';
import { $spreadsheetId } from '../spreadsheet';

export const AppGate = createGate();

export const $apiParams = combine(
  $token,
  $spreadsheetId,
  (token, spreadsheetId) => ({
    token,
    spreadsheetId,
  })
);
export const $isApiReady = $apiParams.map(
  ({ token, spreadsheetId }) => !!(token && spreadsheetId)
);
