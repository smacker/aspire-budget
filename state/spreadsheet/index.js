import { app } from '../app/domain';
import { createGate } from 'effector-react';

export const SpreadsheetsGate = createGate();

export const loadSpreadsheetList = app.createEvent();
export const selectSpreadsheetId = app.createEvent();

export const loadSpreadsheetIdFx = app.createEffect();
export const loadSpreadsheetListFx = app.createEffect();
export const selectSpreadsheetIdFx = app.createEffect();
export const removeSpreadsheetIdFx = app.createEffect();

export const $spreadsheetId = app.createStore(null);
export const $spreadsheetError = app.createStore(null);
export const $spreadsheets = app.createStore([]);
export const $spreadsheetsError = app.createStore(null);
