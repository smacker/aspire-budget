import {
  loadAccounts,
  addTransaction,
  loadAccountsFx,
  addTransactionFx,
  $accounts,
  AccountsGate,
} from './';
import { $apiParams, $isApiReady } from '../app';
import {
  fetchTransactionAccounts,
  addTransaction as fetchAddTransaction,
} from '../../api/gsheets';
import { guard, forward, attach } from 'effector';

loadAccountsFx.use(({ token, spreadsheetId }) =>
  fetchTransactionAccounts(token, spreadsheetId)
);

addTransactionFx.use(({ token, spreadsheetId, data }) =>
  fetchAddTransaction(token, spreadsheetId, data)
);

forward({
  from: AccountsGate.open,
  to: [loadAccounts],
});

guard({
  clock: loadAccounts,
  source: $apiParams,
  filter: $isApiReady,
  target: loadAccountsFx,
});

guard({
  source: addTransaction,
  filter: $isApiReady,
  target: attach({
    effect: addTransactionFx,
    source: $apiParams,
    mapParams: (data, { token, spreadsheetId }) => ({
      token,
      spreadsheetId,
      data,
    }),
  }),
});

$accounts.on(loadAccountsFx.doneData, (_, data) => data);
