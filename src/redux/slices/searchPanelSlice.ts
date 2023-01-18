import { createSlice } from "@reduxjs/toolkit";

import { UserFields, MessageFields, SearchSliceState, ChatFields } from "../../types/interfaces";



const initialState: SearchSliceState = {
    foundChats: [],
    foundMessages: [],
    searchValue: ''
}
export const searchPanelSlice = createSlice({
    name: 'searchPanel',
    initialState,
    reducers: {
        findChats(state, action) {
            state.foundChats = action.payload.filter((chat: ChatFields) => {
                return chat.memberData!.displayName.toLocaleLowerCase().includes(state.searchValue.toLowerCase());
            })
        },
        findMessages(state, action) { 
            const { chatList, membersData, searchValue, currentUserEmail } = action.payload
            let foundMessages: MessageFields[] = [];

            chatList.forEach((chat: ChatFields) => {
                const messages = chat.messages.filter((message) => {
                    return message.type === 'text' && message.content.toLocaleLowerCase().includes(searchValue.toLowerCase())
                })

                const messagesWithChatData = messages.map((message) => {
                    return {...message, chatId: chat.id, lastTimeMembersRead: chat.lastTimeMembersRead}
                })

                foundMessages = [...foundMessages, ...messagesWithChatData]
            })

            state.foundMessages = foundMessages.map((message) => {
                const memberData: UserFields = membersData.find((memberData: UserFields) => {
                    if (message.from !== 'user') {
                        return memberData.email === message.from
                    } else {
                        return memberData.email === currentUserEmail
                    }
                });
                return {...message, displayName: memberData.displayName, photoURL: memberData.photoURL}
            })
        },
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
        resetFoundItems(state) {
            state.foundChats = [];
            state.foundMessages = [];
        }
    }
})


export const { findChats, findMessages, setSearchValue, resetFoundItems } = searchPanelSlice.actions;