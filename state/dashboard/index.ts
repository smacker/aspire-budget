import { app } from '../app/domain';
import { createGate } from 'effector-react';
import { Category, Stats } from '../../types';

export const CategoriesGate = createGate();

export const loadCategories = app.createEvent();

export const loadCategoriesFx = app.createEffect<void, Category[], Error>();

export const $categoriesPending = loadCategoriesFx.pending;
export const $categoriesError = app.createStore<Error>(null);
export const $categories = app.createStore<Category[]>([]);

//

export const StatsGate = createGate();

export const loadStats = app.createEvent();

export const loadStatsFx = app.createEffect<void, Stats, Error>();

export const $statsPending = loadCategoriesFx.pending;
export const $stats = app.createStore<Stats>({});
