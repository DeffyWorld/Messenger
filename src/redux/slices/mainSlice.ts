import { createSlice } from "@reduxjs/toolkit";

import { MainSliceState } from "../../types/interfaces";
import { EnumSortParams } from "../../types/enums"



const initialState: MainSliceState = {
    sortBy: EnumSortParams.Newest,
    isChatOpen: false,
    isSideBarActive: false,
    isDropdownActive: false
}
export const mainSlice = createSlice ({
    name: 'main',
    initialState,
    reducers: {
        setSortBy(state, action) {
            state.sortBy = action.payload
        },
        setIsChatOpen(state, action) {
            state.isChatOpen = action.payload;
            state.isSideBarActive = false;
        },
        setIsSideBarActive(state) {
            state.isSideBarActive = !state.isSideBarActive;
        },
        setIsDropdownActive(state, action) {
            state.isDropdownActive = action.payload;
        }
    }
})



export const { setSortBy, setIsChatOpen, setIsSideBarActive, setIsDropdownActive } = mainSlice.actions;