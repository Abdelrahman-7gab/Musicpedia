import { createSlice } from '@reduxjs/toolkit';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICard, ITrack } from 'src/app/services/Imusic';

//slice

export interface trackState {
  lyrics: string;
  item: ICard | null;
  status: string;
  error: any;
}

const initialState: trackState = {
  lyrics: '',
  item: { id: -1, type: 'null' },
  status: 'idle',
  error: null,
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    getLyrics: (state, _action) => {
      state.lyrics = 'Trying to get Lyrics ...';
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
      state.item = null;
    },
    changeItemMetadata: (state, action) => {
      state.item = action.payload.item;
      state.status = 'loadedItem';
    },
    getItemFail: (state, action) => {
      state.status = 'fail';
      state.error = action.payload.error;
    },
    getAlbums: (state, action) => {
      state.status = 'loadingAlbums';
    },
    changeAlbums: (state, action) => {
      state.status = 'loadedAlbums';
      state.item!.albums = action.payload.albums;
    },
    getAlbumsFail: (state, action) => {
      state.status = 'failedAlbums';
      state.error = action.payload.error;
    },
  },
});

//exports
const {
  reducer,
  actions: {
    getLyrics,
    changeLyrics,
    getLyricsFail,
    changeItemMetadata,
    getItem,
    getItemFail,
    getAlbums,
    getAlbumsFail,
    changeAlbums,
  },
} = metadataSlice;

export default reducer;
export {
  getLyrics,
  changeLyrics,
  getLyricsFail,
  changeItemMetadata,
  getItem,
  getItemFail,
  getAlbums,
  getAlbumsFail,
  changeAlbums,
};

//Selectors
const featureSelector = createFeatureSelector<
  ReturnType<typeof metadataSlice.reducer>
>(metadataSlice.name);

export const selectLyrics = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.lyrics
);

export const selectItem = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.item
);

export const selectStatus = createSelector(
  featureSelector,
  (state: ReturnType<typeof metadataSlice.reducer>) => state.status
);
