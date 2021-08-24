import { guard, forward } from 'effector';
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
} from './index';
import { $isApiReady } from '../app';
import api from '../../api';

loadCategoriesFx.use(() => api.fetchCategoriesBalance());

forward({
  from: CategoriesGate.open,
  to: [loadCategories],
});

guard({
  source: loadCategories,
  filter: $isApiReady,
  target: loadCategoriesFx,
});

$categories.on(loadCategoriesFx.doneData, (_, data) => data);
$categoriesError.on(loadCategoriesFx.failData, (_, data) => data);

//

loadStatsFx.use(() => api.fetchMainStats());

forward({
  from: StatsGate.open,
  to: [loadStats],
});

guard({
  source: loadStats,
  filter: $isApiReady,
  target: loadStatsFx,
});

$stats.on(loadStatsFx.doneData, (_, data) => data);
