import { combineReducers, configureStore } from "@reduxjs/toolkit";
import localForage from "localforage";
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';

import { authorizationSlice } from "./slices/authorizationSlice";
import { chatSlice } from "./slices/chatSlice";
import { mainSlice } from "./slices/mainSlice";
import { searchPanelSlice } from "./slices/searchPanelSlice";
import { sidebarSlice } from "./slices/sidebarSlice";



const rootPersistConfig = {
    key: 'root',
    storage: localForage,
    blacklist: ['searchPanel', 'chat']
};
const authorizationSlicePersistConfig = {
    key: 'authorization',
    storage: localForage,
    blacklist: ['authorizationErrors', 'loader']
};

const rootReducer = combineReducers({
    authorization: persistReducer(authorizationSlicePersistConfig, authorizationSlice.reducer),
    main: mainSlice.reducer,
    sidebar: sidebarSlice.reducer,
    searchPanel: searchPanelSlice.reducer,
    chat: chatSlice.reducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);



const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});



export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;