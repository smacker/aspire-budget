import { app } from '../app/domain';
import { createGate } from 'effector-react';
import { Balance } from '../../types';

export const BalancesGate = createGate();

export const loadBalances = app.createEvent();

export const loadBalancesFx = app.createEffect<
  { token: string; spreadsheetId: string },
  Balance[],
  Error
>();

export const $balancesPending = loadBalancesFx.pending;
export const $balancesError = app.createStore<Error>(null);
export const $balances = app.createStore<Balance[]>([]);
