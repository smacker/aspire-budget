import AsyncStorage from '@react-native-async-storage/async-storage';
import { forward } from 'effector';
import {
  setLocale,
  setCurrencyCode,
  setLocaleFx,
  loadCurrencyCodeFx,
  setCurrencyCodeFx,
  $locale,
  $currencyCode,
} from './index';
import { $spreadsheetConfig } from '../spreadsheet/index';

setLocaleFx.use(async (value) => {
  const err = new Error('Unknown locale');
  try {
    if (!Intl.NumberFormat.supportedLocalesOf(value).length) {
      throw err;
    }
  } catch (e) {
    throw err;
  }

  return value;
});

const CURRENCY_CODE_KEY = '@currency_code_key';

loadCurrencyCodeFx.use(async () => {
  try {
    return await loadOrThrow(CURRENCY_CODE_KEY);
  } catch (e) {
    // ignore error, default locale currency code be used
  }
});

setCurrencyCodeFx.use(async (currency) => {
  const err = new Error('Unknown currency code');

  try {
    const nf = new Intl.NumberFormat('en', {
      style: 'currency',
      currencyDisplay: 'name',
      currency,
    });
    const fmt = nf.format(123);
    if (
      fmt.substring(0, 3) === currency ||
      fmt.substring(fmt.length - 3) === currency
    ) {
      throw err;
    }
  } catch (e) {
    throw err;
  }

  await AsyncStorage.setItem(CURRENCY_CODE_KEY, currency);
  return currency;
});

async function loadOrThrow(key: string) {
  const value = await AsyncStorage.getItem(key);
  if (value) {
    return value;
  }

  throw new Error('no value');
}

$locale.on(setLocaleFx.doneData, (_, data) => data);
$currencyCode
  .on(loadCurrencyCodeFx.doneData, (_, data) => data)
  .on(setCurrencyCodeFx.doneData, (_, data) => data);

forward({
  // convert en_GB (google sheets) to en-GB required by Intl module
  from: $spreadsheetConfig.map((config) => config?.locale.replace('_', '-')),
  to: setLocaleFx,
});

forward({
  from: setLocale,
  to: setLocaleFx,
});

forward({
  from: setCurrencyCode,
  to: setCurrencyCodeFx,
});
