import { forward } from 'effector';

import '../auth/init';
import '../spreadsheet/init';
import '../dashboard/init';
import '../balances/init';
import '../transactions/init';

import { AppGate } from '.';
import { loadAuthDataFx } from '../auth';
import { loadSpreadsheetIdFx } from '../spreadsheet';
import { addTransactionFx } from '../transactions';
import { loadCategories, loadStats } from '../dashboard';
import { loadBalances } from '../balances';

forward({
  from: AppGate.open,
  to: [loadAuthDataFx, loadSpreadsheetIdFx],
});

forward({
  from: addTransactionFx.done,
  to: [loadCategories, loadStats, loadBalances],
});