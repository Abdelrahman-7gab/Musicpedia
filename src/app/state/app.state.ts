import { ActionReducerMap } from "@ngrx/store";
import searchReducer from "./searchResults/searchResults.store";
import  playingAudioReducer from "./playingAudio/playingAudio.store";


export const reducers:ActionReducerMap<any> = {
    playingAudio:playingAudioReducer,
    searchResults:searchReducer,
}

// reducers[playingAudioSlice.name] = playingAudioSlice.reducer;