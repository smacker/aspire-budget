import { app } from '../app/domain';
import { createGate } from 'effector-react';
import { Spreadsheet } from '../../types';

export const SpreadsheetsGate = createGate();

export const loadSpreadsheetList = app.createEvent();
export const selectSpreadsheetId = app.createEvent<string>();

export const loadSpreadsheetIdFx = app.createEffect<
  void,
  string | null,
  Error
>();
export const loadSpreadsheetListFx = app.createEffect<
  void,
  Spreadsheet[],
  Error
>();
export const selectSpreadsheetIdFx = app.createEffect<string, string, Error>();
export const removeSpreadsheetIdFx = app.createEffect<void, void, Error>();

export const $spreadsheetId = app.createStore<string>(null);
export const $spreadsheetError = app.createStore<Error>(null);
export const $spreadsheets = app.createStore<Spreadsheet[]>([]);
export const $spreadsheetsError = app.createStore<Error>(null);
