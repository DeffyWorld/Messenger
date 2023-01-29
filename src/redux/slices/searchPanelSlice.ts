import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NavigateFunction } from "react-router-dom";
import { firestore } from "../../firebase";
import { EnumThunkStatus } from "../../types/enums";
import { ChatFields, SearchSliceState, UserFields } from "../../types/interfaces";
import { createChat } from "./sidebarSlice";



export const findUsers = createAsyncThunk<any, { currentUserEmail: string, searchValue: string }, { rejectValue: string }>(
    'searchPanel/findUsers', async ({ currentUserEmail, searchValue }, { rejectWithValue }) => {
        try {
            let foundUsers: any = [];

            const usersByDisplayName = await getDocs(query(collection(firestore, 'users'), where('displayName', '==', searchValue)));
            const usersByEmail = await getDocs(query(collection(firestore, 'users'), where('email', '==', searchValue)));

            usersByDisplayName.forEach((user) => foundUsers = [...foundUsers, user.data()]);
            usersByEmail.forEach((user) => foundUsers = [...foundUsers, user.data()]);

            return foundUsers;
        } catch (error: any) {
            rejectWithValue(error.code);
        }
    }
)

export const findOrCreateChat = createAsyncThunk<any, { chatWith: string, currentUserEmail: string, navigate: NavigateFunction }, { rejectValue: string }>(
    'searchPanel/findOrCreateChat', async ({ chatWith, currentUserEmail, navigate }, { rejectWithValue, dispatch }) => {
        try {
            let id: number | undefined = undefined;

            const foundChatSnapshot = await getDocs(query(collection(firestore, 'chats'), where('members', 'in', [
                [chatWith, chatWith === 'tailorswift@gmail.com' || chatWith === 'barakobama@gmail.com' ? 'user' : currentUserEmail],
                [chatWith === 'tailorswift@gmail.com' || chatWith === 'barakobama@gmail.com' ? 'user' : currentUserEmail, chatWith]
            ])))
            
            if (foundChatSnapshot.empty === false) {
                id = foundChatSnapshot.docs[0].data().id;
            } else {
                id = (await dispatch(createChat({ currentUserEmail: currentUserEmail, inputValue: chatWith }))).payload
            }

            return id;
        } catch (error: any) {
            rejectWithValue(error.code);
        }
    }
)

export const findMessages = createAsyncThunk<any, { searchValue: string, currentUserEmail: string }, { rejectValue: string }>(
    'searchPanel/findMessages', async ({ searchValue, currentUserEmail }, { rejectWithValue, getState }) => {
        try {
            const { main }: any = getState();
            let foundMessages: any = [];

            const requests = main.chatsData.map((chatData: ChatFields) => {
                return getDocs(query(collection(firestore, `messages/${chatData.id}/chatMessages`), where('content', "==", searchValue)));
            })

            const respSnapArr = await Promise.all(requests);

            respSnapArr.forEach(respSnap => {
                respSnap.forEach((resp: any) => {
                    if (resp.exists() === true) {
                        const message = resp.data();
                        const chat = main.chatsData.find((chat: ChatFields) => chat.id === message.chatId);
                        const memberData = main.membersData.find((memberData: UserFields) => {
                            return message.from === 'user' ? memberData.email === currentUserEmail : memberData.email === message.from
                        });
                        foundMessages = [...foundMessages, {
                            ...message,
                            lastTimeMembersRead: chat!.lastTimeMembersRead,
                            displayName: memberData.displayName,
                            photoURL: memberData.photoURL
                        }]
                    }
                })
            })

            return foundMessages
        } catch (error: any) {
            rejectWithValue(error.code);
        }
    }
)



const initialState: SearchSliceState = {
    foundUsers: undefined,
    foundMessages: undefined,
    findUsersStatus: null,
    findMessagesStatus: null,
    findOrCreateChatStatus: null,
    isSearchValueEmpty: true
}
export const searchPanelSlice = createSlice({
    name: 'searchPanel',
    initialState,
    reducers: {
        setIsSearchValueEmpty(state, action) {
            state.isSearchValueEmpty = action.payload;
        },
        resetFoundItems(state) {
            state.foundUsers = undefined;
            state.foundMessages = undefined;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(findUsers.pending, (state) => {
                state.findUsersStatus = EnumThunkStatus.Pending;
            })
            .addCase(findUsers.fulfilled, (state, action) => {
                state.foundUsers = action.payload;
                state.findUsersStatus = EnumThunkStatus.Fulfilled;
            })
            .addCase(findUsers.rejected, (state, action) => {
                state.findUsersStatus = EnumThunkStatus.Rejected;
                console.error(action.payload);
            })

            .addCase(findOrCreateChat.pending, (state) => {
                state.findOrCreateChatStatus = EnumThunkStatus.Pending;
            })
            .addCase(findOrCreateChat.fulfilled, (state, action) => {
                state.findOrCreateChatStatus = EnumThunkStatus.Fulfilled;
            })
            .addCase(findOrCreateChat.rejected, (state, action) => {
                state.findOrCreateChatStatus = EnumThunkStatus.Rejected;
                console.error(action.payload);
            })

            .addCase(findMessages.pending, (state) => {
                state.findMessagesStatus = EnumThunkStatus.Pending;
            })
            .addCase(findMessages.fulfilled, (state, action) => {
                state.foundMessages = action.payload;
                state.findMessagesStatus = EnumThunkStatus.Fulfilled;
            })
            .addCase(findMessages.rejected, (state, action) => {
                state.findMessagesStatus = EnumThunkStatus.Rejected;
                console.error(action.payload);
            })
    },
})


export const { setIsSearchValueEmpty, resetFoundItems } = searchPanelSlice.actions;