import { app } from '../app/domain';
import { createGate } from 'effector-react';

export const CategoriesGate = createGate();

export const loadCategories = app.createEvent();

export const loadCategoriesFx = app.createEffect();

export const $categoriesPending = loadCategoriesFx.pending;
export const $categoriesError = app.createStore(null);
export const $categories = app.createStore([]);

//

export const StatsGate = createGate();

export const loadStats = app.createEvent();

export const loadStatsFx = app.createEffect();

export const $statsPending = loadCategoriesFx.pending;
export const $stats = app.createStore({});
