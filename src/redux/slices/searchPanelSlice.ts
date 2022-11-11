import { createSlice } from "@reduxjs/toolkit";
import { SearchPanelState } from "../../types/interfaces";


const initialState: SearchPanelState = {
    searchValue: ''
}
export const searchPanelSlice = createSlice ({
    name: 'searchPanel',
    initialState,
    reducers: {
        setSearchValue(state, payload) {
            state.searchValue = payload.payload;
        }
    }
})


export const { setSearchValue } = searchPanelSlice.actions;