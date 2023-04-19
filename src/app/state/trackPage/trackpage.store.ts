import { createSlice } from '@reduxjs/toolkit';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITrack } from 'src/app/services/Imusic';

//slice

export interface trackState {
  track: string;
  song: ITrack;
}

const trackPageSlice = createSlice({
  name: 'trackPage',
  initialState: {
    lyrics: '',
    song: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    getLyrics: (state, _action) => {
      state.status = 'loading';
    },
    changeLyrics: (state, action) => {
      state.lyrics = action.payload.lyrics;
    },
    changeSong: (state, action) => {
      state.song = action.payload.song;
    },
    getLyricsFail: (state, action) => {
      state.status = 'fail';
      state.lyrics = '';
      state.error = action.payload.error;
    },
    getSong: (state, action) => {
      state.status = 'success';
      state.song = action.payload.song;
    }
  },
});

//exports
const {
  reducer,
  actions: { getLyrics, changeLyrics, getLyricsFail,changeSong,getSong },
} = trackPageSlice;

export default reducer;
export { getLyrics, changeLyrics, getLyricsFail,changeSong,getSong };

//Selectors
const featureSelector = createFeatureSelector<
  ReturnType<typeof trackPageSlice.reducer>
>(trackPageSlice.name);

export const selectLyrics = createSelector(
  featureSelector,
  (state: ReturnType<typeof trackPageSlice.reducer>) => state.lyrics
);

export const selectSong = createSelector(
  featureSelector,
  (state: ReturnType<typeof trackPageSlice.reducer>) => state.song
);

export const selectStatus = createSelector(
  featureSelector,
  (state: ReturnType<typeof trackPageSlice.reducer>) => state.status
);
