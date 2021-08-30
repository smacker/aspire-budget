import {
  loadAccounts,
  loadAccountsFx,
  addTransactionFx,
  $accounts,
  $txError,
  AccountsGate,
} from './index';
import { $isApiReady } from '../app';
import { guard, forward } from 'effector';
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

$accounts.on(loadAccountsFx.doneData, (_, data) => data);
$txError
  .reset(AccountsGate.close, addTransactionFx)
  .on(addTransactionFx.failData, (_, data) => data);
