import { createAction,props } from "@ngrx/store";

export const playAudio = createAction(
    "[Audio] Play Audio",
    props<{uuid:string}>()
)
export const stopAudio = createAction(
    "[Audio] Stop Audio",
) 