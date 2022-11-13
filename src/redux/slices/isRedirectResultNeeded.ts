import { createSlice } from "@reduxjs/toolkit";
import { IsRedirectResultNeededState } from "../../types/interfaces";


const initialState: IsRedirectResultNeededState = {
    isRedirectResultNeeded: false
}
export const isRedirectResultNeededSlice = createSlice ({
    name: 'isRedirectResultNeeded',
    initialState,
    reducers: {
        setIsRedirectResultNeeded(state, action) {
            state.isRedirectResultNeeded = action.payload;
        }
    }
})


export const { setIsRedirectResultNeeded } = isRedirectResultNeededSlice.actions;