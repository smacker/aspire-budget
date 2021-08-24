import {
  loadAccounts,
  addTransaction,
  loadAccountsFx,
  addTransactionFx,
  $accounts,
  AccountsGate,
} from './index';
import { $isApiReady } from '../app';
import { guard, forward, attach } from 'effector';
import api from '../../api';

loadAccountsFx.use(() => api.fetchTransactionAccounts());
addTransactionFx.use((data) => api.fetchAddTransaction(data));

forward({
  from: AccountsGate.open,
  to: [loadAccounts],
});

guard({
  source: loadAccounts,
  filter: $isApiReady,
  target: loadAccountsFx,
});

guard({
  source: addTransaction,
  filter: $isApiReady,
  target: addTransactionFx,
});

$accounts.on(loadAccountsFx.doneData, (_, data) => data);
