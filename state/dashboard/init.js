import {
  loadCategories,
  loadCategoriesFx,
  $categories,
  $categoriesError,
  CategoriesGate,
  loadStatsFx,
  StatsGate,
  loadStats,
  $stats,
} from './';
import { $apiParams, $isApiReady } from '../app';
import { fetchCategoriesBalance, fetchMainStats } from '../../api/gsheets';
import { guard, forward } from 'effector';

loadCategoriesFx.use(({ token, spreadsheetId }) =>
  fetchCategoriesBalance(token, spreadsheetId)
);

forward({
  from: CategoriesGate.open,
  to: [loadCategories],
});

guard({
  clock: loadCategories,
  source: $apiParams,
  filter: $isApiReady,
  target: loadCategoriesFx,
});

$categories.on(loadCategoriesFx.doneData, (_, data) => data);
$categoriesError.on(loadCategoriesFx.failData, (_, data) => data);

//

loadStatsFx.use(({ token, spreadsheetId }) =>
  fetchMainStats(token, spreadsheetId)
);

forward({
  from: StatsGate.open,
  to: [loadStats],
});

guard({
  clock: loadStats,
  source: $apiParams,
  filter: $isApiReady,
  target: loadStatsFx,
});

$stats.on(loadStatsFx.doneData, (_, data) => data);
