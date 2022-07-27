import * as SecureStore from 'expo-secure-store';
import { forward, guard } from 'effector';
import { $isAuth, logout } from '../auth';
import {
  selectSpreadsheetId,
  loadSpreadsheetList,
  loadSpreadsheetListFx,
  loadSpreadsheetIdFx,
  selectSpreadsheetIdFx,
  loadSpreadsheetConfigFx,
  removeSpreadsheetIdFx,
  $spreadsheets,
  $spreadsheetsError,
  $spreadsheetId,
  $spreadsheetError,
  $spreadsheetConfig,
  SpreadsheetsGate,
} from './index';
import api from '../../api';

const spreadsheetIdKey = 'aspire-spreadsheet-id';

// effects

loadSpreadsheetIdFx.use(async () => {
  const storedValue = await SecureStore.getItemAsync(spreadsheetIdKey);
  if (!storedValue) {
    return null;
  }

  api.setSpreadsheetId(storedValue);

  return storedValue;
});

selectSpreadsheetIdFx.use(async (id) => {
  const isValid = await api.verifySpreadSheet(id);
  if (!isValid) {
    throw 'spreadsheet is not valid';
  }

  api.setSpreadsheetId(id);
  await SecureStore.setItemAsync(spreadsheetIdKey, id);

  return id;
});

loadSpreadsheetConfigFx.use(() => api.fetchConfig());

loadSpreadsheetListFx.use(() => api.fetchSpreadSheets());

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

$spreadsheetConfig.on(loadSpreadsheetConfigFx.doneData, (_, data) => data);

$spreadsheets.on(loadSpreadsheetListFx.doneData, (_, data) => data);
$spreadsheetsError.on(loadSpreadsheetListFx.failData, (_, data) => data);

// links

forward({
  from: SpreadsheetsGate.open,
  to: loadSpreadsheetList,
});

guard({
  source: loadSpreadsheetList,
  filter: $isAuth,
  target: loadSpreadsheetListFx,
});

guard({
  source: selectSpreadsheetId,
  filter: $isAuth,
  target: selectSpreadsheetIdFx,
});

forward({
  from: $spreadsheetId,
  to: loadSpreadsheetConfigFx,
});

forward({
  from: logout,
  to: removeSpreadsheetIdFx,
});
