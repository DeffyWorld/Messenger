import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SidebarSliceState } from "../../types/interfaces";
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';



export const createChat = createAsyncThunk<any, { currentUserEmail: string, inputValue: string }, { rejectValue: string }>(
    'sidebar/createChat', async ({ currentUserEmail, inputValue }, { rejectWithValue }) => {
        try {
            const id = Date.now();

            await setDoc(doc(firestore, "chats", `${id}`), {
                id: id,
                lastTimeMembersRead: {},
                members: [currentUserEmail, inputValue],
                lastMessage: null
            })

            const splittedCurrentUserEmail = currentUserEmail.split('.')[0];
            const inputEmail = inputValue.split('.')[0];
            await updateDoc(doc(firestore, 'chats', `${id}`), {
                [`lastTimeMembersRead.${splittedCurrentUserEmail}`]: 0,
                [`lastTimeMembersRead.${inputEmail}`]: 0
            })

            return id;
        } catch (error: any) {
            rejectWithValue(error.code)
        }
    }
)



const initialState: SidebarSliceState = {
    isSidebarActive: false
}
export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setIsSidebarActive(state, action) {
            state.isSidebarActive = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(createChat.rejected, (state, action) => {
            console.error(action);
        })
    },
})



export const { setIsSidebarActive } = sidebarSlice.actions;