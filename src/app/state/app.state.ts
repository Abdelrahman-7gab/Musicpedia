import { ActionReducerMap } from "@ngrx/store";
import { getSearchResults } from "./searchResults/searchResults.actions";
import {searchApiState,searchReducer } from "./searchResults/searchResults.reducer";
import  playingAudioReducer  from "./playingAudio/playingAudio.store";

export interface AppState{
    playingAudio:any,
    searchResults:searchApiState
}

export const reducers:ActionReducerMap<AppState> = {
    playingAudio:playingAudioReducer,
    searchResults:searchReducer,
}

// reducers[playingAudioSlice.name] = playingAudioSlice.reducer;