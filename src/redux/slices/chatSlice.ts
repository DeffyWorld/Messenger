import { createSlice } from "@reduxjs/toolkit";
import { ChatState } from "../../types/interfaces";


const initialState: ChatState = {
    isChatOpen: false,
    chatWithId: null,
    focusMessageTimestamp: null
}
export const chatSlice = createSlice ({
    name: 'chat',
    initialState,
    reducers: {
        setIsChatOpen(state) {
            state.isChatOpen = true;
        },
        setChat(state, payload) {
            state.chatWithId = payload.payload.id;
            state.focusMessageTimestamp = payload.payload.focusMessageTimestamp;
        },
        resetIsChatOpen(state) {
            state.isChatOpen = false;
        },
        resetChat(state) {
            state.isChatOpen = false;
            state.chatWithId = null;
            state.focusMessageTimestamp = null;
        }
    }
})


export const { setIsChatOpen, setChat, resetIsChatOpen, resetChat } = chatSlice.actions;