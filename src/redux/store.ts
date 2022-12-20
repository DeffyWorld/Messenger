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
import { mainSlice } from "./slices/mainSlice";
import { searchPanelSlice } from "./slices/searchPanelSlice";
import { chatSlice } from "./slices/chatSlice";



const rootPersistConfig = {
    key: 'root',
    storage: localForage,
    whitelist: ['main', 'chat']
};

const authorizationPersistConfig = {
    key: 'authorization',
    storage: localForage,
    blacklist: ['authorizationErrors', 'loader']
};

const rootReducer = combineReducers({
    authorization: persistReducer(authorizationPersistConfig, authorizationSlice.reducer),
    main: mainSlice.reducer,
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