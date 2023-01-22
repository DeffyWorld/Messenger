import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AuthorizationFormInputs, AuthorizationState } from "../../types/interfaces";
import { EnumThunkStatus } from "../../types/enums";

import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect, updateProfile, User } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { database, firestore } from "../../firebase";
import { ref, onValue, onDisconnect, set } from "firebase/database";





export const presence = createAsyncThunk<any, { currentUser: User }, { rejectValue: string }>(
    'authorization/presence', ({ currentUser }, { rejectWithValue }) => {
        const userStatusDatabaseRef = ref(database, `usersStatus/${currentUser.uid}`);

        const isOfflineForDatabase = {
            email: currentUser.email,
            isOnline: false,
            wasOnline: Date.now(),
        };
        const isOnlineForDatabase = {
            user: currentUser.email,
            isOnline: true,
            wasOnline: 0,
        };

        onValue(ref(database, '.info/connected'), (snap) => {
            if (snap.val() === true) {
                onDisconnect(userStatusDatabaseRef)
                    .set(isOfflineForDatabase)
                    .then(() => {
                        set(userStatusDatabaseRef, isOnlineForDatabase)
                        return
                    })
                    .catch((error) => {
                        return rejectWithValue(error.code)
                    })
            }
        });
    }
)

export const createUserOrSignIn = createAsyncThunk<any, {
    auth: Auth,
    activeTab: string,
    data: AuthorizationFormInputs,
}, { rejectValue: string }>(
    'authorization/createUserOrSignIn', async ({ auth, activeTab, data }, { rejectWithValue }) => {
        if (activeTab === 'logIn') {
            return signInWithEmailAndPassword(auth, data.email, data.password)
                .then(() => {
                    return
                })
                .catch((error) => {
                    return rejectWithValue(error.code);
                })
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                await updateProfile(userCredential.user, { displayName: `${data.name} ${data.surname}` });
                await setDoc(doc(collection(firestore, "users"), `${userCredential.user.email}`), {
                    displayName: `${data.name} ${data.surname}`,
                    email: `${userCredential.user.email}`,
                    photoURL: userCredential.user.photoURL !== '' && userCredential.user.photoURL === 'null'
                        ? `${userCredential.user.photoURL}`
                        : 'https://pmdoc.ua/wp-content/uploads/default-avatar.png',
                    uid: `${userCredential.user.uid}`,
                    isTyping: false
                })
                return
            } catch (error: any) {
                return rejectWithValue(error.code);
            }
        }
    }
)

export const authorizationWithGoogle = createAsyncThunk<any, {
    isRedirectResultNeeded: boolean,
    auth: Auth,
    currentUser?: User,
}, { rejectValue: string }>(
    'authorization/authorizationWithGoogle', async ({ isRedirectResultNeeded, auth, currentUser }, { rejectWithValue }) => {
        if (isRedirectResultNeeded === false) {
            const provider = new GoogleAuthProvider();
            return signInWithRedirect(auth, provider)
                .then(() => {
                    return
                })
                .catch((error) => {
                    return rejectWithValue(error.code);
                })
        } else {
            try {
                const docSnap = await getDoc(doc(firestore, 'users', currentUser!.email!));
                !docSnap.exists() && await setDoc(doc(collection(firestore, "users"), `${currentUser!.email}`), {
                    displayName: currentUser!.displayName,
                    email: currentUser!.email,
                    photoURL: currentUser!.photoURL !== '' && currentUser!.photoURL !== null
                        ? currentUser!.photoURL
                        : 'https://pmdoc.ua/wp-content/uploads/default-avatar.png',
                    uid: currentUser!.uid,
                    isTyping: false
                })
                return
            } catch (error: any) {
                return rejectWithValue(error.code);
            }
        }

    }
)



const initialState: AuthorizationState = {
    isLoading: false,
    loader: '.',
    activeTab: 'logIn',
    authorizationStatus: null,
    authorizationErrors: {
        presence: null,
        createUserOrSignIn: null,
        authorizationWithGoogle: null
    }
}
export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setIsLaoding(state, action) {
            state.isLoading = action.payload;
        },
        setLoader(state, action) {
            state.loader = action.payload;
        },
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(presence.rejected, (state, action) => {
                state.authorizationErrors.presence = action.payload!;
                console.error(action.payload);
            })

            .addCase(createUserOrSignIn.pending, (state) => {
                state.authorizationStatus = EnumThunkStatus.Pending;
                state.isLoading = true;
            })
            .addCase(createUserOrSignIn.fulfilled, (state) => {
                state.authorizationStatus = EnumThunkStatus.Fulfilled;
                state.isLoading = false;
            })
            .addCase(createUserOrSignIn.rejected, (state, action) => {
                state.authorizationStatus = EnumThunkStatus.Rejected;
                state.isLoading = false;
                state.authorizationErrors.createUserOrSignIn = action.payload!;
                console.error(action.payload);
            })

            .addCase(authorizationWithGoogle.pending, (state) => {
                state.authorizationStatus = EnumThunkStatus.Pending;
                state.isLoading = true;
            })
            .addCase(authorizationWithGoogle.fulfilled, (state) => {
                state.authorizationStatus = EnumThunkStatus.Fulfilled;
                state.isLoading = false;
            })
            .addCase(authorizationWithGoogle.rejected, (state, action) => {
                state.authorizationStatus = EnumThunkStatus.Rejected;
                state.isLoading = false;
                state.authorizationErrors.authorizationWithGoogle = action.payload!;
                console.error(action.payload);
            })
    }
})



export const { setIsLaoding, setLoader, setActiveTab } = authorizationSlice.actions;