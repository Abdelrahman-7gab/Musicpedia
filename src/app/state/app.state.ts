import { ActionReducerMap } from "@ngrx/store";
import { playAudioState,playAudioReducer } from "./playingAudio/playingAudio.reducer";
import { getSearchResults } from "./searchResults/searchResults.actions";
import {searchApiState,searchReducer } from "./searchResults/searchResults.reducer";

export interface AppState{
    playingAudio:playAudioState,
    searchResults:searchApiState
}

export const reducers:ActionReducerMap<AppState> = {
    playingAudio:playAudioReducer,
    searchResults:searchReducer
}