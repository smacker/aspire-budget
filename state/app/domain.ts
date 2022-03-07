import { createDomain } from 'effector';

export const app = createDomain();

app.onCreateEffect((effect) => {
  effect.fail.watch(({ params, error }) => {
    console.error(
      `effect '${effect.name}' called with params`,
      params,
      'failed with error',
      error
    );
  });
});
