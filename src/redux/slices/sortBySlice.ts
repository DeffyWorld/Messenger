import { createSlice } from "@reduxjs/toolkit";

import { SortBySliceState } from "../../types/interfaces";
import { EnumSortParams } from "../../types/enums"



const initialState: SortBySliceState = {
    sortBy: EnumSortParams.Newest,
    isDropdownActive: false
}
export const sortBySlice = createSlice({
    name: 'sortBy',
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



export const { setSortBy, setIsDropdownActive } = sortBySlice.actions;