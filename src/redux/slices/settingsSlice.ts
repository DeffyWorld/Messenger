import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SettingsSliceState } from "../../types/interfaces";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { EnumThunkStatus } from "../../types/enums";



export const setProfile = createAsyncThunk<any, { editedAvatarDataUrl: string | null, name: string | undefined, currentUserEmail: string }, { rejectValue: string }>(
    'chat/setProfile', async ({ editedAvatarDataUrl, name, currentUserEmail }, { rejectWithValue }) => {
        const auth = getAuth();

        const getNewAvatarUrl = async () => {
            const result = await fetch(editedAvatarDataUrl!);
            const blob = await result.blob();
            const avatarStorageRef = ref(storage, `avatars/${Date.now()}.png`);
            await uploadBytes(avatarStorageRef, blob);
            const newAvatarUrl = await getDownloadURL(avatarStorageRef);

            return newAvatarUrl
        }

        try {
            if (editedAvatarDataUrl !== null && name !== undefined) {
                const newAvatarUrl = await getNewAvatarUrl();

                await updateProfile(auth.currentUser!, {
                    photoURL: newAvatarUrl,
                    displayName: name
                })
                await updateDoc(doc(firestore, 'users', currentUserEmail), {
                    photoURL: newAvatarUrl,
                    displayName: name
                })

                return
            }
            if (editedAvatarDataUrl !== null) {
                const newAvatarUrl = await getNewAvatarUrl();

                await updateProfile(auth.currentUser!, {
                    photoURL: newAvatarUrl
                })
                await updateDoc(doc(firestore, 'users', currentUserEmail), {
                    photoURL: newAvatarUrl
                })

                return
            }
            if (name !== undefined) {
                await updateProfile(auth.currentUser!, {
                    displayName: name
                })
                await updateDoc(doc(firestore, 'users', currentUserEmail), {
                    displayName: name
                })

                return
            }
        } catch (error: any) {
            rejectWithValue(error.message);
        }
    }
)



const initialState: SettingsSliceState = {
    editedAvatarURL: null,
    editedAvatarDataUrl: null,
    setProfileStatus: null
}
export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setEditedAvatar(state, action) {
            state.editedAvatarURL = action.payload.editedAvatarURL;
            state.editedAvatarDataUrl = action.payload.editedAvatarDataUrl;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(setProfile.pending, (state) => {
                state.setProfileStatus = EnumThunkStatus.Pending;
            })
            .addCase(setProfile.fulfilled, (state) => {
                state.setProfileStatus = EnumThunkStatus.Fulfilled;
            })
            .addCase(setProfile.rejected, (state, action) => {
                state.setProfileStatus = EnumThunkStatus.Rejected;
                console.log(action.payload);
            })
    }
})



export const { setEditedAvatar } = settingsSlice.actions;