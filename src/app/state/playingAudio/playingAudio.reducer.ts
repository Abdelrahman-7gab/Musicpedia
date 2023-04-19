import { createReducer,on } from "@ngrx/store";
import { playAudio,stopAudio } from "./playingAudio.actions";

export interface playAudioState{
    uuid:string;
    active:boolean;
}

export const initialState:playAudioState = {
    uuid :"",
    active:false
}

export const playAudioReducer = createReducer(
   initialState,
    on(playAudio,(state,action)=>{
        return {
            uuid:action.uuid,
            active:true
        }
    }   
    ),
    on(stopAudio,(state,action)=>{
        return {
            ...state,
            active:false
        }
    }
    ))
    