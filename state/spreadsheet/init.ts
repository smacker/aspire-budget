import * as SecureStore from 'expo-secure-store';
import { forward, guard, attach } from 'effector';
import { fetchSpreadSheets, verifySpreadSheet } from '../../api/gsheets';
import { $token, $isAuth, logout } from '../auth';
import {
  selectSpreadsheetId,
  loadSpreadsheetList,
  loadSpreadsheetListFx,
  loadSpreadsheetIdFx,
  selectSpreadsheetIdFx,
  removeSpreadsheetIdFx,
  $spreadsheets,
  $spreadsheetsError,
  $spreadsheetId,
  $spreadsheetError,
  SpreadsheetsGate,
} from '.';

const spreadsheetIdKey = 'aspire-spreadsheet-id';

const verify = async (token: string, id: string) => {
  let isValid = false;

  try {
    isValid = await verifySpreadSheet(token, id);
  } catch (e) {
    // map api error to customer friendly
    if (e.type === 'status' && e.status === 400) {
      throw 'spreadsheet is not valid';
    } else {
      console.error('verifySpreadSheet', e);
      throw 'something went wrong';
    }

    // FIXME need to do something about it on api level probably?
    // if (e.type === 'status' && e.status === 401) {
    //   setErrorText('unauthorized');
    // }
  }

  if (!isValid) {
    throw 'spreadsheet is not valid';
  }

  await SecureStore.setItemAsync(spreadsheetIdKey, id);

  return id;
};

// effects

loadSpreadsheetIdFx.use(async () => {
  let storedValue = await SecureStore.getItemAsync(spreadsheetIdKey);
  if (!storedValue) {
    return null;
  }

  return storedValue;
});

selectSpreadsheetIdFx.use(async ({ token, id }) => {
  return verify(token, id);
});

loadSpreadsheetListFx.use(async ({ token }) => {
  return fetchSpreadSheets(token);
});

removeSpreadsheetIdFx.use(async () => {
  await SecureStore.deleteItemAsync(spreadsheetIdKey);
});

// store

$spreadsheetId
  .reset(removeSpreadsheetIdFx)
  .on(loadSpreadsheetIdFx.doneData, (_, id) => id)
  .on(selectSpreadsheetIdFx.doneData, (_, id) => id);

$spreadsheetError
  .reset(selectSpreadsheetId)
  .on(selectSpreadsheetIdFx.failData, (_, err) => err);

$spreadsheets.on(loadSpreadsheetListFx.doneData, (_, data) => data);
$spreadsheetsError.on(loadSpreadsheetListFx.failData, (_, data) => data);

// links

forward({
  from: SpreadsheetsGate.open,
  to: loadSpreadsheetList,
});

guard({
  clock: loadSpreadsheetList,
  source: $token.map((token) => ({ token })),
  filter: $isAuth,
  target: loadSpreadsheetListFx,
});

guard({
  source: selectSpreadsheetId,
  filter: $isAuth,
  target: attach({
    effect: selectSpreadsheetIdFx,
    source: $token,
    mapParams: (id: string, token: string) => ({ token, id }),
  }),
});

forward({
  from: logout,
  to: removeSpreadsheetIdFx,
});
