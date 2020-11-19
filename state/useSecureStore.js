import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

function useSecureStore(key) {
  const [isReady, setIsReady] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const init = async () => {
      const token = await SecureStore.getItemAsync(key);
      setValue(token);
      setIsReady(true);
    };
    init();
  }, [key]);

  return [
    isReady,
    value,
    (value) => {
      setValue(value);

      if (value !== null) {
        SecureStore.setItemAsync(key, value);
      } else {
        SecureStore.deleteItemAsync(key);
      }
    },
  ];
}

export default useSecureStore;
