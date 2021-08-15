import { app } from '../app/domain';
import { createGate } from 'effector-react';

export const BalancesGate = createGate();

export const loadBalances = app.createEvent();

export const loadBalancesFx = app.createEffect();

export const $balancesPending = loadBalancesFx.pending;
export const $balancesError = app.createStore(null);
export const $balances = app.createStore([]);
