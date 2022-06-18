import { ActionReducerMap } from "@ngrx/store";
import searchReducer from "./searchResults/searchResults.store";
import  playingAudioReducer from "./playingAudio/playingAudio.store";
import { searchEffects } from "./searchResults/searchResults.effects";
import trackPageReducer from "./trackPage/trackpage.store";
import { trackPageEffects } from "./trackPage/trackpage.effects";



export const reducers:ActionReducerMap<any> = {
    playingAudio:playingAudioReducer,
    searchResults:searchReducer,
    trackPage:trackPageReducer
}

export const effects:any[] = [searchEffects,trackPageEffects];

// reducers[playingAudioSlice.name] = playingAudioSlice.reducer;