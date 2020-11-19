import React, { createContext } from 'react';
import {
  verifySpreadSheet,
  fetchSpreadSheets,
  fetchCategoriesBalance,
  fetchBalances,
  fetchTransactionAccounts,
  addTransaction,
} from '../api/gsheets';

export const ApiContext = createContext({});

export const ApiProvider = (props) => {
  const { token, spreadsheetId, onUnauthorizedError, children } = props;

  const gsheetCall = (fn, ...params) => () =>
    fn(token, spreadsheetId, ...params).catch((e) => {
      if (e.type === 'status' && e.status === 401) {
        onUnauthorizedError();
      }

      throw e;
    });

  const context = {
    fetchSpreadSheets: gsheetCall(fetchSpreadSheets),
    verifySpreadSheet: gsheetCall(verifySpreadSheet),

    fetchCategoriesBalance: gsheetCall(fetchCategoriesBalance),
    fetchBalances: gsheetCall(fetchBalances),
    fetchTransactionAccounts: gsheetCall(fetchTransactionAccounts), // cache it

    addTransaction: (data) => gsheetCall(addTransaction, data)(),
  };

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};
