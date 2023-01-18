import { createSlice } from "@reduxjs/toolkit";

import { SidebarSliceState } from "../../types/interfaces";



const initialState: SidebarSliceState = {
    isSidebarActive: false
}
export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setIsSidebarActive(state, action) {
            state.isSidebarActive = action.payload;
        }
    }
})



export const { setIsSidebarActive } = sidebarSlice.actions;