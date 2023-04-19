import { createSlice } from '@reduxjs/toolkit';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICard, ITrack } from 'src/app/services/Imusic';

//slice

export interface trackState {
  lyrics: string;
  track: ICard;
  status: string;
  error:any;
  album?:ICard;
  artist?:ICard
}

const initialState:trackState = {
  lyrics: '',
  track: {id:-1,type:"null"},
  status: 'idle',
  error: null,
}

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    getLyrics: (state, _action) => {
    state.lyrics="Trying to get Lyrics ...";
      state.status = 'loadingLyrics';
    },
    changeLyrics: (state, action) => {
      state.lyrics = action.payload.lyrics;
      state.status = 'loadedLyrics';
    },
    getLyricsFail: (state, action) => {
      state.status = 'failedLyrics';
      state.lyrics = "Can't find lyrics.";  
      state.error = action.payload.error;
    },
    getItem: (state, action) => {
      state.status = 'loadingItem';
    },
    changeItemMetadata: (state, action) => {
      state.track = action.payload.track;
      state.album = action.payload.album;
      state.artist = action.payload.artist;
    },
    getItemFail: (state, action) => {
      state.status = 'fail';
      state.error = action.payload.error;
    }
  },
});

//exports
const {
  reducer,
  actions: { getLyrics, changeLyrics, getLyricsFail,changeItemMetadata,getItem,getItemFail },
} = metadataSlice;

export default reducer;
export { getLyrics, changeLyrics, getLyricsFail,changeItemMetadata,getItem,getItemFail };

//Selectors
const featureSelector = createFeatureSelector<
  ReturnType<typeof metadataSlice.reducer>
>(metadataSlice.name);

export const selectLyrics = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.lyrics
);

export const selectSong = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.track
);

export const selectAlbum = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.album
);

export const selectArtist = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.artist
);

export const selectStatus = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.status
);
