import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { activeUserPayload, activeUserState } from "../../types/redux";


const initialState: activeUserState = {
    displayName: null,
	email: null,
    uid: null
}
export const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers: {
        setUser(state: activeUserState, payload: PayloadAction<activeUserPayload>) {
            state.displayName = payload.payload.displayName;
            state.email = payload.payload.email;
            state.uid = payload.payload.uid;
        },
        removeUser(state: activeUserState) {
            state.displayName = null;
            state.email = null;
            state.uid = null;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;