import React, { createContext, useCallback } from 'react';
import useGoogleAuth from './useGoogleAuth';
import useSpreadsheet from './useSpreadsheet';
import useAsync from './useAsync';
import {
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
  // the hook automatically tries to refresh token if credentials exist in local storage
  const [authStatus, token, login, logout, refresh] = useGoogleAuth();
  // auto validate correctness of spreadsheet id as long as it is set
  const [
    spreadsheetStatus,
    spreadsheetId,
    setSpreadsheetId,
    spreadsheetErrorMsg,
    spreadsheetVerify,
  ] = useSpreadsheet(token);

  const spreadsheet = {
    status: spreadsheetStatus,
    value: spreadsheetId,
    setValue: setSpreadsheetId,
    error: spreadsheetErrorMsg,
    execute: spreadsheetVerify,
  };

  // define data getter (no side effects)
  const useApiCallOpts = { token, spreadsheetId, onUnauthorizedError: refresh };
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
