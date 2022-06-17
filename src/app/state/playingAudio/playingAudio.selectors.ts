import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { playAudioState } from './playingAudio.reducer';

export const selectPlayingAudio = (state: AppState) => state.playingAudio;
export const selectUUID = createSelector(
  selectPlayingAudio,
  (state: playAudioState) => state.uuid
);
export const selectActive = createSelector(
  selectPlayingAudio,
  (state: playAudioState) => state.active
);
