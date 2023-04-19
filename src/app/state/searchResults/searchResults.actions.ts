import { createAction,props } from "@ngrx/store";
import { searchApiState } from "./searchResults.reducer";

export const getSearchResults = createAction(
    "[search] get search results",
    props<{query:string,queryType:string}>()
)

export const sucessfulSearch = createAction(
    "[search] Succuessful search",
    props<{results:searchApiState}>()
)

export const failedSearch = createAction(
    "[search] Failed search",
    props<{error:string}>()
)