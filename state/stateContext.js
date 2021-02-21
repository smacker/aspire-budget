import React, { createContext, useCallback, useEffect } from 'react';
import useGoogleAuth from './useGoogleAuth';
import useSecureStore from './useSecureStore';
import useAsync from './useAsync';
import {
  verifySpreadSheet,
  fetchSpreadSheets,
  fetchMainStats,
  fetchCategoriesBalance,
  fetchBalances,
  fetchTransactionAccounts,
  addTransaction,
} from '../api/gsheets';

export const StateContext = createContext({});

function useApiCall(fn, options) {
  const { token, spreadsheetId, onUnauthorizedError } = options;

  return useCallback(
    (...params) => {
      return fn(token, spreadsheetId, ...params).catch((e) => {
        if (e.type === 'status' && e.status === 401) {
          console.error(e);
          onUnauthorizedError(e);
        }

        if (e.type === 'status') {
          throw e.data.error.message;
        }

        throw e;
      });
    },
    [fn, token, spreadsheetId, onUnauthorizedError]
  );
}

export const StateProvider = (props) => {
  const [authStatus, token, login, logout, refresh] = useGoogleAuth();
  const [isIdReady, spreadsheetId, setSpreadsheetId] = useSecureStore(
    'aspire-spreadsheet-id'
  );

  const useApiCallOpts = { token, spreadsheetId, onUnauthorizedError: refresh };

  const verify = useAsync(useApiCall(verifySpreadSheet, useApiCallOpts), false);
  // to avoid warning as linter of useEffect doesn't understand verify.execute
  const verifyExecute = verify.execute;
  // consider failed validation as an error
  const spreadsheetError =
    verify.status === 'success' && !verify.value
      ? 'spreadsheet is not valid'
      : null;
  // map status taking into account async store and error logic above
  const spreadsheetStatus = !isIdReady
    ? 'pending'
    : spreadsheetError
    ? 'error'
    : verify.status;
  const spreadsheet = {
    status: spreadsheetStatus,
    value: spreadsheetId,
    setValue: setSpreadsheetId,
    error: verify.error ? verify.error : spreadsheetError,
    execute: verify.execute,
  };

  // validate spreadsheet on init, id change, token change (execute depends on the token)
  useEffect(() => {
    if (!spreadsheetId) return;
    verifyExecute();
  }, [spreadsheetId, verifyExecute]);

  const stats = useAsync(useApiCall(fetchMainStats, useApiCallOpts), false);

  const categories = useAsync(
    useApiCall(fetchCategoriesBalance, useApiCallOpts),
    false
  );
  const balances = useAsync(useApiCall(fetchBalances, useApiCallOpts), false);
  const transactionAccounts = useAsync(
    useApiCall(fetchTransactionAccounts, useApiCallOpts),
    false
  );

  const context = {
    // auth related data
    authStatus,
    login,
    logout: useCallback(() => {
      logout();
      setSpreadsheetId(null);
    }, [logout, setSpreadsheetId]),

    // selected aspire spreadsheet
    spreadsheet,

    // global state
    stats,
    categories,
    balances,
    transactionAccounts,

    // methods that don't need global state
    fetchSpreadSheets: useApiCall(fetchSpreadSheets, {
      token,
      onUnauthorizedError: refresh,
    }),
    addTransaction: useApiCall(addTransaction, useApiCallOpts),
  };

  return (
    <StateContext.Provider value={context}>
      {props.children}
    </StateContext.Provider>
  );
};
