import AsyncStorage from '@react-native-async-storage/async-storage';
import { forward } from 'effector';
import {
  setLocale,
  setCurrencyCode,
  loadLocaleFx,
  setLocaleFx,
  loadCurrencyCodeFx,
  setCurrencyCodeFx,
  $locale,
  $currencyCode,
} from './index';

const LOCALE_KEY = '@locale_key';

loadLocaleFx.use(() => loadOrThrow(LOCALE_KEY));

setLocaleFx.use(async (value) => {
  const err = new Error('Unknown locale');
  try {
    if (!Intl.NumberFormat.supportedLocalesOf(value).length) {
      throw err;
    }
  } catch (e) {
    throw err;
  }

  await AsyncStorage.setItem(LOCALE_KEY, value);
  return value;
});

const CURRENCY_CODE_KEY = '@currency_code_key';

loadCurrencyCodeFx.use(() => loadOrThrow(CURRENCY_CODE_KEY));

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

$locale.on(loadLocaleFx, (_, data) => data).on(setLocaleFx, (_, data) => data);
$currencyCode
  .on(loadCurrencyCodeFx, (_, data) => data)
  .on(setCurrencyCodeFx, (_, data) => data);

forward({
  from: setLocale,
  to: setLocaleFx,
});

forward({
  from: setCurrencyCode,
  to: setCurrencyCodeFx,
});
