import { fork, allSettled } from 'effector';

import { app } from '../app/domain';
import '../app/init';
import {
  loadSpreadsheetIdFx,
  loadSpreadsheetList,
  selectSpreadsheetId,
  $spreadsheetId,
  $spreadsheetError,
  $spreadsheets,
} from '../spreadsheet';
import { gSignIn, $token, logout } from '../auth';

import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-google-app-auth';
import * as api from '../../api/gsheets';
jest.mock('expo-secure-store');
jest.mock('expo-google-app-auth');
jest.mock('../../api/gsheets');

async function googleLogIn(scope) {
  // mock google auth
  Google.logInAsync.mockResolvedValue({
    type: 'success',
    accessToken: 'token',
    refreshToken: 'refreshToken',
  });

  // set auth token
  await allSettled(gSignIn, {
    scope: scope,
  });
  const token = scope.getState($token);
  expect(token).toEqual('token');
}

async function loadSpreadsheetId(scope, selectedId) {
  SecureStore.getItemAsync.mockResolvedValue(selectedId);

  await allSettled(loadSpreadsheetIdFx, {
    scope: scope,
  });
  let spreadsheetId = scope.getState($spreadsheetId);
  expect(spreadsheetId).toEqual(selectedId);
}

test('load from storage: no value', async () => {
  const scope = fork(app);

  SecureStore.getItemAsync.mockResolvedValue(null);

  await allSettled(loadSpreadsheetIdFx, {
    scope: scope,
  });
  let spreadsheetId = scope.getState($spreadsheetId);
  expect(spreadsheetId).toBeNull();

  expect(SecureStore.getItemAsync).toHaveBeenCalledWith(
    'aspire-spreadsheet-id'
  );
});

test('load from storage: success', async () => {
  const scope = fork(app);

  await loadSpreadsheetId(scope, 'id1');

  expect(SecureStore.getItemAsync).toHaveBeenCalledWith(
    'aspire-spreadsheet-id'
  );
});

test('select id success', async () => {
  const scope = fork(app);
  await googleLogIn(scope);

  const selectedId = 'id1';
  api.verifySpreadSheet.mockResolvedValue(true);

  // choose a spreadsheet
  await allSettled(selectSpreadsheetId, {
    scope: scope,
    params: selectedId,
  });
  const spreadsheetId = scope.getState($spreadsheetId);
  expect(spreadsheetId).toEqual(selectedId);

  expect(api.verifySpreadSheet).toHaveBeenCalledWith('token', 'id1');
});

test('select id invalid', async () => {
  const scope = fork(app);
  await googleLogIn(scope);

  const selectedId = 'id1';
  api.verifySpreadSheet.mockResolvedValue(false);

  // choose a spreadsheet
  await allSettled(selectSpreadsheetId, {
    scope: scope,
    params: selectedId,
  });
  const spreadsheetId = scope.getState($spreadsheetId);
  expect(spreadsheetId).toBeNull();
  const spreadsheetError = scope.getState($spreadsheetError);
  expect(spreadsheetError).toEqual('spreadsheet is not valid');

  expect(api.verifySpreadSheet).toHaveBeenCalledWith('token', 'id1');
});

test('load list success', async () => {
  const scope = fork(app);
  await googleLogIn(scope);

  // mock api call
  const spreadsheetsList = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ];
  api.fetchSpreadSheets.mockResolvedValue(spreadsheetsList);

  // load list of spreadsheets
  await allSettled(loadSpreadsheetList, {
    scope: scope,
  });
  let spreadsheets = scope.getState($spreadsheets);
  expect(spreadsheets).toEqual(spreadsheetsList);

  expect(api.fetchSpreadSheets).toHaveBeenCalledWith('token');
});

test('logout should remove selected id', async () => {
  const scope = fork(app);
  await loadSpreadsheetId(scope, 'id1');

  await allSettled(logout, {
    scope: scope,
  });
  const spreadsheetId = scope.getState($spreadsheetId);
  expect(spreadsheetId).toBeNull();

  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
    'aspire-spreadsheet-id'
  );
});
