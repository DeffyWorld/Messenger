import { createSlice } from "@reduxjs/toolkit";

import { MainSliceState } from "../../types/interfaces";
import { EnumSortParams } from "../../types/enums"



const initialState: MainSliceState = {
    chatsData: null,
    membersData: null,
    membersStatus: null,
    sortBy: EnumSortParams.Newest,
    isDropdownActive: false
}
export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setChatsData(state, action) {
            state.chatsData = action.payload;
        },
        setMembersData(state, action) {
            state.membersData = action.payload;
        },
        setMembersStatus(state, action) {
            if (state.membersStatus === null) {
                state.membersStatus = [action.payload];
            } else {
                const foundElem = state.membersStatus.find((memberStatus) => memberStatus.email === action.payload.email);
                if (foundElem === undefined) {
                    state.membersStatus = [...state.membersStatus!, action.payload]
                } else {
                    state.membersStatus![state.membersStatus.indexOf(foundElem)] = action.payload
                }
            }
        },
        setSortBy(state, action) {
            state.sortBy = action.payload;
        },
        setIsDropdownActive(state, action) {
            state.isDropdownActive = action.payload;
        }
    }
})



export const { setChatsData, setMembersData, setMembersStatus, setSortBy, setIsDropdownActive } = mainSlice.actions;