import { createSlice } from "@reduxjs/toolkit";
import { ShouldSetNewDocState } from "../../types/interfaces";


const initialState: ShouldSetNewDocState = {
    shouldSetNewDoc: false
}
export const shouldSetNewDocSlice = createSlice ({
    name: 'shouldSetNewDoc',
    initialState,
    reducers: {
        setShouldSetNewDoc(state, action) {
            state.shouldSetNewDoc = action.payload;
        }
    }
})


export const { setShouldSetNewDoc } = shouldSetNewDocSlice.actions;