import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import {searchApiState} from './searchResults.reducer'

export const searchResults = (state: AppState) => state.searchResults;
export const selectResults = createSelector(
    searchResults,
  (state: searchApiState) => state.data
);
export const selectNext = createSelector(
    searchResults,
  (state: searchApiState) => state.next
);

export const selectStatus = createSelector(
    searchResults,
    (state: searchApiState) => state.status
);

export const selectTotal = createSelector(
    searchResults,
    (state: searchApiState) => state.total
);
