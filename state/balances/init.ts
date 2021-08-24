import { guard, forward } from 'effector';
import {
  loadBalances,
  loadBalancesFx,
  $balances,
  $balancesError,
  BalancesGate,
} from './index';
import { $isApiReady } from '../app';
import api from '../../api';

loadBalancesFx.use(() => api.fetchBalances());

forward({
  from: BalancesGate.open,
  to: [loadBalances],
});

guard({
  source: loadBalances,
  filter: $isApiReady,
  target: loadBalancesFx,
});

$balances.on(loadBalancesFx.doneData, (_, data) => data);
$balancesError.on(loadBalancesFx.failData, (_, data) => data);
