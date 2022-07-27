import { app } from '../app/domain';
import { combine } from 'effector';
import * as Localization from 'expo-localization';

export const setLocale = app.createEvent<string>();
export const setCurrencyCode = app.createEvent<string>();

export const setLocaleFx = app.createEffect<string, string, Error>();
export const loadCurrencyCodeFx = app.createEffect<void, string, Error>();
export const setCurrencyCodeFx = app.createEffect<string, string, Error>();

export const $locale = app.createStore<string>(Localization.locale || 'en-US');
export const $currencyCode = app.createStore<string>('USD');

export const $currencyFormatter = combine(
  $locale,
  $currencyCode,
  (locale, currencyCode) => {
    // polyfill doesn't support `currencyDisplay=narrowSymbol`
    // so hard-code en-US locale to be able to display $ instead of US$
    const q = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currencyDisplay: 'symbol',
      currency: currencyCode,
    });

    return q;
  }
);

export const $dateFormatter = $locale.map((locale) => {
  return new Intl.DateTimeFormat(locale).format;
});
