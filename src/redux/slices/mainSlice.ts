import { createSlice } from "@reduxjs/toolkit";

import { MainSliceState } from "../../types/interfaces";
import { EnumSortParams } from "../../types/enums"



const initialState: MainSliceState = {
    sortBy: EnumSortParams.Newest,
    isDropdownActive: false
}
export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setSortBy(state, action) {
            state.sortBy = action.payload;
        },
        setIsDropdownActive(state, action) {
            state.isDropdownActive = action.payload;
        }
    }
})



export const { setSortBy, setIsDropdownActive } = mainSlice.actions;