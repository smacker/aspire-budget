import {
  loadBalances,
  loadBalancesFx,
  $balances,
  $balancesError,
  BalancesGate,
} from './';
import { $apiParams, $isApiReady } from '../app';
import { fetchBalances } from '../../api/gsheets';
import { guard, forward } from 'effector';

loadBalancesFx.use(({ token, spreadsheetId }) =>
  fetchBalances(token, spreadsheetId)
);

forward({
  from: BalancesGate.open,
  to: [loadBalances],
});

guard({
  clock: loadBalances,
  source: $apiParams,
  filter: $isApiReady,
  target: loadBalancesFx,
});

$balances.on(loadBalancesFx.doneData, (_, data) => data);
$balancesError.on(loadBalancesFx.failData, (_, data) => data);
