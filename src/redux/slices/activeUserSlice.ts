import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { activeUserPayload, activeUserState } from "../../types/redux";


const initialState: activeUserState = {
    name: null,
	surname: null,
	email: null,
	password: null
}
export const activeUserSlice = createSlice ({
    name: 'activeUser',
    initialState,
    reducers: {
        setActiveUser(state: activeUserState, payload: PayloadAction<activeUserPayload>) {
            state.name = payload.payload.name;
            state.surname = payload.payload.surname;
            state.email = payload.payload.email;
            state.password = payload.payload.password;
        },
        resetActiveUser(state: activeUserState) {
            state.name = null;
            state.surname = null;
            state.email = null;
            state.password = null;
        }
    }
})

export const { setActiveUser, resetActiveUser } = activeUserSlice.actions;