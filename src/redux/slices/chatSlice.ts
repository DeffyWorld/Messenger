import { createSlice } from "@reduxjs/toolkit";
import { ChatState } from "../../types/interfaces";


const initialState: ChatState = {
    chatWithId: null,
    focusMessageTimestamp: null
}
export const chatSlice = createSlice ({
    name: 'chat',
    initialState,
    reducers: {
        setChat(state, payload) {
            state.chatWithId = payload.payload.id;
            state.focusMessageTimestamp = payload.payload.focusMessageTimestamp;
        },
        resetChat(state) {
            // state.isChatOpen = false;
            state.chatWithId = null;
            state.focusMessageTimestamp = null;
        }
    }
})


export const { setChat, resetChat } = chatSlice.actions;