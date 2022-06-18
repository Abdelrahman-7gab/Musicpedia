import { ActionReducerMap } from "@ngrx/store";
import searchReducer from "./searchResults/searchResults.store";
import  playingAudioReducer from "./playingAudio/playingAudio.store";
import { searchEffects } from "./searchResults/searchResults.effects";
import metadataReducer from "./metadata/metadata.store";
import { trackPageEffects } from "./metadata/metadata.effects";



export const reducers:ActionReducerMap<any> = {
    playingAudio:playingAudioReducer,
    searchResults:searchReducer,
    metadata:metadataReducer
}

export const effects:any[] = [searchEffects,trackPageEffects];

// reducers[playingAudioSlice.name] = playingAudioSlice.reducer;