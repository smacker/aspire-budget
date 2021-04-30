import { useState, useEffect, useCallback, useRef } from 'react';

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // promises don't support cancellation
  // but a promise can be resolved only after a component was unmounted
  // or two promises running at the same time can produce unexpected results
  //
  // we need to avoid updating the state in such cases
  // for each promise we run, increase the ref id and assign it to the promise
  // if id in ref doesn't equal by the time of resolution -> it was cancelled
  const lastPromiseIdRef = useRef(0);

  const execute = useCallback(() => {
    const promiseId = ++lastPromiseIdRef.current;

    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        if (lastPromiseIdRef.current != promiseId) return;

        setValue(response);
        setStatus('success');
      })
      .catch((error) => {
        if (lastPromiseIdRef.current != promiseId) return;

        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    // clean-up function is called before unmounting a component
    return () => {
      // use longer form to avoid warning
      lastPromiseIdRef.current = lastPromiseIdRef.current + 1;
    };
  }, [execute, immediate]);

  return { execute, status, value, error };
}

export default useAsync;

export function useRequireAsync(status, execute) {
  useEffect(() => {
    if (status !== 'idle') return;
    execute();
  }, [status, execute]);
}

export function useRefreshIfNeeded(status, execute) {
  useEffect(() => {
    if (status === 'idle') return;
    execute();
  }, [status, execute]);
}
