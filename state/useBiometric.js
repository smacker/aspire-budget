import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const biometricKey = 'aspire-biometric-enabled';

export function useBiometricIsAvailable() {
  const [isReady, setReady] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (isReady) {
      return;
    }

    const init = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setReady(true);
        return;
      }
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setReady(true);
        return;
      }

      setAvailable(true);
      setReady(true);
    };

    init();
  }, [isReady, setAvailable]);

  return [isReady, available];
}

export function useBiometricIsEnabled() {
  const [isReady, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isReady) {
      return;
    }

    SecureStore.getItemAsync(biometricKey).then((ok) => {
      setEnabled(!!ok);
      setReady(true);
    });
  }, [isReady]);

  return [isReady, enabled];
  //return [true, true];
}

export async function biometricSetEnable(value) {
  if (value) {
    SecureStore.setItemAsync(biometricKey, 'yes');
  } else {
    SecureStore.deleteItemAsync(biometricKey);
  }
}

// returns true after successful auth
function useBiometric() {
  const [availableReady, available] = useBiometricIsAvailable();
  const [enabledReady, enabled] = useBiometricIsEnabled();
  const [success, setSuccess] = useState(false);

  // actually checking biometric login
  useEffect(() => {
    if (success) {
      return;
    }

    // waiting means no check yet
    if (!enabledReady || !availableReady) {
      return;
    }

    // not enabled or available considered as successful login
    if (!enabled || !available) {
      setSuccess(true);
      return;
    }

    LocalAuthentication.authenticateAsync().then(({ success, error }) => {
      if (success) {
        setSuccess(true);
      }

      if (error) {
        console.error('biometric error:', error);
      }
    });
  }, [success, enabledReady, availableReady, enabled, available]);

  return [success];
}

export default useBiometric;
