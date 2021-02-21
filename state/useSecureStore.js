import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

function useSecureStore(key, isObject = false) {
  const [isReady, setIsReady] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (isReady) {
      return;
    }

    const init = async () => {
      let storedValue = await SecureStore.getItemAsync(key);
      setValue(isObject ? JSON.parse(storedValue) : storedValue);
      setIsReady(true);
    };

    init();
  }, [key, isObject, isReady]);

  const setValueExported = useCallback(
    (value) => {
      setValue(value);

      if (value !== null) {
        SecureStore.setItemAsync(key, isObject ? JSON.stringify(value) : value);
      } else {
        SecureStore.deleteItemAsync(key);
      }
    },
    [key, isObject]
  );

  return [isReady, value, setValueExported];
}

export default useSecureStore;
