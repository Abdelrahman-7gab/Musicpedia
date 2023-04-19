import { createSlice } from '@reduxjs/toolkit';
import { createFeatureSelector, createSelector } from '@ngrx/store';


//slice
const playingAudioSlice = createSlice({
  name: 'playingAudio',
  initialState: {
    uuid: '',
    active: false,
  },
  reducers: {
    changePlayingSound: (state, action) => {
      state.uuid = action.payload;
      state.active = true;
    },
    stopPlayingSound: (state, action) => {
      state.uuid = '';  
      state.active = false;
    },
  },
});


//exports
const {
  reducer,
  actions: { changePlayingSound, stopPlayingSound },
} = playingAudioSlice;

export default reducer;
export { changePlayingSound, stopPlayingSound };

//Selectors
const featureSelector = createFeatureSelector<
  ReturnType<typeof playingAudioSlice.reducer>
>(playingAudioSlice.name);

export const UUIDSelector = createSelector(
    featureSelector,
    (state: ReturnType<typeof playingAudioSlice.reducer>) => state.uuid
  );