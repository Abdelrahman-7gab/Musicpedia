import { createReducer,on } from "@ngrx/store";
import { getSearchResults,sucessfulSearch,failedSearch } from "./searchResults.actions";
import { ICard } from "../../services/Imusic";

export enum searchStatus{
    loading,sucessfull,failed,idle
}

export interface searchApiState{
    data: ICard[];
    total: number;
    next?: string;
    status?:searchStatus;
}

const initialState:searchApiState = {
    data:[],
    total:-1,
    status:searchStatus.idle
}


export const searchReducer = createReducer(
    initialState,
    on(sucessfulSearch,(state,action)=>{
        return {
            data:action.results.data,
            total:action.results.total,
            status:searchStatus.sucessfull,
            next:action.results.next
        }
    }
    ),
    on(failedSearch,(state,action)=>{
        return {
            status:searchStatus.failed,
            data:[],
            total:-1
        }
    }
    )
)