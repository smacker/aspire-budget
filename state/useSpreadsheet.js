import { useState, useEffect, useCallback } from 'react';
import { verifySpreadSheet } from '../api/gsheets';
import useSecureStore from './useSecureStore';

const spreadsheetIdKey = 'aspire-spreadsheet-id';

const statePending = 'pending';
const stateSuccess = 'success';
const stateError = 'error';

function useSpreadsheet(token) {
  const [status, setStatus] = useState(null);
  const [isIdReady, id, setId] = useSecureStore(spreadsheetIdKey);
  const [errorText, setErrorText] = useState(null);

  useEffect(() => {
    if (!isIdReady || !token) return;

    if (!id) {
      setStatus(stateError);
      setErrorText(null); // no need to show message in such case
      return;
    }

    verify();
  }, [isIdReady, id, token, verify]);

  const verify = useCallback(async () => {
    if (!token) return;

    setStatus(statePending);

    try {
      const isValid = await verifySpreadSheet(token, id);
      setStatus(isValid ? stateSuccess : stateError);
      setErrorText(isValid ? null : 'spreadsheet is not valid');
    } catch (e) {
      setStatus(stateError);
      // FIXME there should be a helper for it
      if (e.type === 'status' && e.status === 401) {
        setErrorText('unauthorized');
      } else if (e.type === 'status' && e.status === 400) {
        setErrorText('spreadsheet is not valid');
      } else {
        console.error('verifySpreadSheet', e);
        setErrorText('something went wrong');
      }
    }
  }, [token, id]);

  return [status, id, setId, errorText, verify];
}

export default useSpreadsheet;
