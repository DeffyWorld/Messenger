import { createSlice } from "@reduxjs/toolkit";
import { ChatState } from "../../types/interfaces";


const initialState: ChatState = {
    isChatOpen: false,
	chatWith: null,
    chatWithId: null,
    focusMessageTimestamp: null
}
export const chatSlice = createSlice ({
    name: 'chat',
    initialState,
    reducers: {
        setChat(state, payload) {
            state.isChatOpen = true;
            state.chatWith = payload.payload.email;
            state.chatWithId = payload.payload.id;
            state.focusMessageTimestamp = payload.payload.focusMessageTimestamp;
        },
        resetChat(state) {
            state.isChatOpen = false;
            state.chatWith = null;
            state.chatWithId = null;
            state.focusMessageTimestamp = null;
        }
    }
})


export const { setChat, resetChat } = chatSlice.actions;