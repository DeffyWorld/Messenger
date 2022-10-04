import { createSlice } from "@reduxjs/toolkit";
import { SearchPanelState } from "../../types/interfaces";


const initialState: SearchPanelState = {
    searchValue: '',
    shouldSearchPanelRender: false
}
export const searchPanelSlice = createSlice ({
    name: 'searchPanel',
    initialState,
    reducers: {
        setSearchValue(state, payload) {
            state.searchValue = payload.payload;
        },
        setShouldSearchPanelRender(state) {
            state.shouldSearchPanelRender = !state.shouldSearchPanelRender;
        }
    }
})


export const { setSearchValue, setShouldSearchPanelRender } = searchPanelSlice.actions;