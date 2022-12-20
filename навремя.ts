import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AuthorizationFormInputs, AuthorizationState } from "../../types/interfaces";

import {
    Auth,
    createUserWithEmailAndPassword,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithRedirect,
    updateProfile,
    User
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { database, firestore } from "../../firebase";
import { ref, onValue, onDisconnect, set } from "firebase/database";
import { NavigateFunction } from "react-router-dom";





export const presence = createAsyncThunk<any, { currentUser: User }, { rejectValue: string }>(
    'authorization/presence', ({ currentUser }, { rejectWithValue }) => {
        const userStatusDatabaseRef = ref(database, `usersStatus/${currentUser.uid}`);

        const isOfflineForDatabase = {
            isOnline: false,
            wasOnline: Date.now(),
        };
        const isOnlineForDatabase = {
            isOnline: true,
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
    navigate: NavigateFunction,
    activeTab: string,
    data: AuthorizationFormInputs,
}, { rejectValue: string }>('authorization/createUserOrSignIn', async ({ auth, navigate, activeTab, data }, { rejectWithValue }) => {
    if (activeTab === 'logIn') {
        return signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                navigate('/', { replace: true });
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
                uid: `${userCredential.user.uid}`
            })
            navigate('/', { replace: true });
            return
        } catch (error: any) {
            return rejectWithValue(error.code);
        }
    }
})

export const googleAuthRedirect = createAsyncThunk<any, { auth: Auth, }, { rejectValue: string }>(
    'authorization/googleAuthRedirect', async ({ auth }, { rejectWithValue }) => {
        const provider = new GoogleAuthProvider();
        return signInWithRedirect(auth, provider)
            .then(() => {
                return
            })
            .catch((error) => {
                return rejectWithValue(error.code);
            })
    }
)

export const googleAuthRedirectResult = createAsyncThunk<any, {
    auth: Auth,
    currentUser: User | null | undefined,
    navigate: NavigateFunction,
}, { rejectValue: string }>(
    'authorization/googleAuthRedirectResult', async ({ auth, currentUser, navigate }, { rejectWithValue }) => {
        try {
            const result = await getRedirectResult(auth);
            const docSnap = await getDoc(doc(firestore, 'users', `${result?.user.email}`));
            !docSnap.exists() && await setDoc(doc(collection(firestore, "users"), `${currentUser?.email}`), {
                displayName: `${currentUser?.displayName}`,
                email: `${currentUser?.email}`,
                photoURL: currentUser?.photoURL !== '' && currentUser?.photoURL === 'null'
                    ? `${currentUser?.photoURL}`
                    : 'https://pmdoc.ua/wp-content/uploads/default-avatar.png',
                uid: `${currentUser?.uid}`
            })
            navigate('/', { replace: true });
            return
        } catch (error: any) {
            return rejectWithValue(error.code);
        }
    }
)



const initialState: AuthorizationState = {
    isRedirectResultNeeded: false,
    isLoading: false,
    loader: '.',
    activeTab: 'logIn',
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
        setIsRedirectResultNeeded(state, action) {
            state.isRedirectResultNeeded = action.payload;
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
            })

            .addCase(createUserOrSignIn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUserOrSignIn.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createUserOrSignIn.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(googleAuthRedirect.pending, (state) => {
                state.isRedirectResultNeeded = true;
            })
            .addCase(googleAuthRedirect.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(googleAuthRedirect.rejected, (state, action) => {
                state.isLoading = false;
                state.authorizationErrors.authorizationWithGoogle = action.payload!;
            })

            .addCase(googleAuthRedirectResult.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(googleAuthRedirectResult.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isRedirectResultNeeded = false;
            })
            .addCase(googleAuthRedirectResult.rejected, (state, action) => {
                state.isLoading = false;
                state.isRedirectResultNeeded = false;
                state.authorizationErrors.authorizationWithGoogle = action.payload!;
            })
    }
})



export const { setIsRedirectResultNeeded, setLoader, setActiveTab } = authorizationSlice.actions;