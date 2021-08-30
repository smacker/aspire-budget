import { app } from '../app/domain';
import { createGate } from 'effector-react';
import { Transaction } from '../../types';

export const AccountsGate = createGate();

export const loadAccounts = app.createEvent();

export const loadAccountsFx = app.createEffect<void, string[], Error>();
export const addTransactionFx = app.createEffect<Transaction, boolean, Error>();

export const $txPending = addTransactionFx.pending;
export const $txError = app.createStore<Error>(null);

export const $accounts = app.createStore<string[]>([]);
