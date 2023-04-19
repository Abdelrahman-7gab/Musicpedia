import { createSlice } from '@reduxjs/toolkit';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const playingAudioSlice = createSlice({
    name: 'playingAudio',
    initialState:{
        uuid: "",
        active:false
    },
    reducers:{
        changePlayingSound: (state,action) => {
            state.uuid = action.payload;
            state.active = true;
        },
        stopPlayingSound: (state,action) => {
            state.active = false;
        }
    }
})

export const featureSelector = createFeatureSelector<ReturnType<typeof playingAudioSlice.reducer>>(
    playingAudioSlice.name
  );

  const {
    reducer,
    actions: { changePlayingSound, stopPlayingSound  },
    name,
  } = playingAudioSlice;
  

  export default playingAudioSlice.reducer;
  export { changePlayingSound,stopPlayingSound,name };
  