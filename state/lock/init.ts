import { forward, combine, guard } from 'effector';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { $isVisible } from '../app';
import {
  isAvailableFx,
  isEnabledFx,
  storeIsEnabledFx,
  tryUnlockFx,
  tryUnlock,
  setEnabled,
  $isAvailable,
  $isEnabled,
  $isLocked,
} from './index';

const biometricKey = 'aspire-biometric-enabled';

isAvailableFx.use(async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return false;
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return false;
  }

  return true;
});

isEnabledFx.use(async () => {
  const enabled = await SecureStore.getItemAsync(biometricKey);
  return !!enabled;
});

storeIsEnabledFx.use(async (enabled) => {
  if (enabled) {
    SecureStore.setItemAsync(biometricKey, 'yes');
  } else {
    SecureStore.deleteItemAsync(biometricKey);
  }
});

tryUnlockFx.use(async () => {
  const { success } = await LocalAuthentication.authenticateAsync();
  return success;
});

// Stores

$isAvailable.on(isAvailableFx.doneData, (_, data) => data);
$isEnabled.on([isEnabledFx.doneData, setEnabled], (_, data) => data);
$isLocked
  .on(isEnabledFx.doneData, (_, data) => data)
  .on(tryUnlockFx.doneData, (_, data) => !data);

// Links

forward({
  from: setEnabled,
  to: storeIsEnabledFx,
});

guard({
  source: tryUnlock,
  filter: combine($isAvailable, $isEnabled, (a, b) => a && b),
  target: tryUnlockFx,
});

const $isUnvisible = $isVisible.map((v) => !v);

guard({
  source: $isUnvisible,
  filter: combine($isUnvisible, $isEnabled, (a, b) => a && b),
  target: $isLocked,
});

guard({
  source: $isVisible,
  filter: $isVisible,
  target: tryUnlock,
});
