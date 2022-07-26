import { AppState } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { forward } from 'effector';

import '../configuration/init';
import '../lock/init';
import '../auth/init';
import '../spreadsheet/init';
import '../dashboard/init';
import '../balances/init';
import '../transactions/init';

import {
  AppGate,
  setVisible,
  loadFontsFx,
  initFx,
  $isReady,
  $isVisible,
} from './index';
import { isAvailableFx, isEnabledFx, tryUnlock } from '../lock';
import { loadLocaleFx, loadCurrencyCodeFx } from '../configuration';
import { initApiFx } from '../auth';
import { loadSpreadsheetIdFx } from '../spreadsheet';
import { addTransactionFx } from '../transactions';
import { loadCategories, loadStats } from '../dashboard';
import { loadBalances } from '../balances';

$isVisible.on(setVisible, (_, data) => data);

loadFontsFx.use(async () => {
  await Font.loadAsync({
    ...Ionicons.font,
    ...MaterialIcons.font,
  });
});

initFx.use(async () => {
  await Promise.all([
    loadFontsFx(),
    isAvailableFx(),
    isEnabledFx(),
    loadLocaleFx(),
    loadCurrencyCodeFx(),
  ]);
  await initApiFx();
  await loadSpreadsheetIdFx();

  tryUnlock();

  return true;
});

$isReady.on(initFx.doneData, (_, data) => data);

forward({
  from: AppGate.open,
  to: initFx,
});

forward({
  from: addTransactionFx.done,
  to: [loadCategories, loadStats, loadBalances],
});

AppState.addEventListener('change', (nextAppState) => {
  const active = nextAppState && nextAppState === 'active';
  setVisible(active);
});
