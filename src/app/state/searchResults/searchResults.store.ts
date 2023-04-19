import { createSlice } from '@reduxjs/toolkit';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const searchSlice = createSlice({
  name: 'searchResults',
  initialState: {
    data: [],
    total: -1,
    next: '',
    status: 'idle',
  },
  reducers: {
    getSearchResults:(state,_action) =>{
        state.status = "loading"
    },
    changeSearchResults: (state, action) => {
      state.data = action.payload.results.data;
      state.total = action.payload.results.total;
      state.next = action.payload.results.next;
      state.status = 'sucessfull';
    },
    failedSearch: (state, _action) => {
      state.status = 'failed';
      state.data = [];
      state.total = -1;
    },
  },
});

//exports
const {
    reducer,
    actions: { getSearchResults,changeSearchResults,failedSearch },
  } = searchSlice;
  
  export default reducer;
  export { getSearchResults,changeSearchResults,failedSearch };
  
  //Selectors
  const featureSelector = createFeatureSelector<
    ReturnType<typeof searchSlice.reducer>
  >(searchSlice.name);
  
  export const selectResults = createSelector(
      featureSelector,
      (state: ReturnType<typeof searchSlice.reducer>) => state.data
    );

  export const selectNext = createSelector(
    featureSelector,
    (state: ReturnType<typeof searchSlice.reducer>) => state.next
  )  

  export const selectTotal = createSelector(
    featureSelector,
    (state: ReturnType<typeof searchSlice.reducer>) => state.total
  )  

  export const selectstatus = createSelector(
    featureSelector,
    (state: ReturnType<typeof searchSlice.reducer>) => state.status
  )   