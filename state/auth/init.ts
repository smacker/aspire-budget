import { forward } from 'effector';
import {
  gSignIn,
  logout,
  initApiFx,
  gSignInFx,
  logoutFx,
  $isAuth,
} from './index';
import api from '../../api';

// effects

initApiFx.use(async () => {
  try {
    await api.init();
    return true;
  } catch (e) {
    return false;
  }
});

gSignInFx.use(async () => {
  await api.login();
  return true;
});

logoutFx.use(() => api.logout());

// store

$isAuth
  .reset(logoutFx)
  .on([initApiFx.doneData, gSignInFx.doneData], (_, data) => data);

// links

forward({
  from: gSignIn,
  to: gSignInFx,
});

forward({
  from: logout,
  to: logoutFx,
});
