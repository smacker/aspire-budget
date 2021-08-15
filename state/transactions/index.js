import { app } from '../app/domain';
import { createGate } from 'effector-react';

export const AccountsGate = createGate();

export const loadAccounts = app.createEvent();
export const addTransaction = app.createEvent();

export const loadAccountsFx = app.createEffect();
export const addTransactionFx = app.createEffect();

export const $txPending = addTransaction.pending;
export const $txError = app.createStore(null);

export const $accounts = app.createStore([]);
