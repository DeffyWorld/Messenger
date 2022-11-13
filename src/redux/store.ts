import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import storage from 'redux-persist/lib/storage';

import { shouldSetNewDocSlice } from "./slices/shouldSetNewDocSlice";
import { searchPanelSlice } from "./slices/searchPanelSlice";
import { chatSlice } from "./slices/chatSlice";
import { isRedirectResultNeededSlice } from "./slices/isRedirectResultNeeded";



const rootReducer = combineReducers({
    shouldSetNewDoc: shouldSetNewDocSlice.reducer,
    isRedirectResultNeeded: isRedirectResultNeededSlice.reducer,
    searchPanel: searchPanelSlice.reducer,
    chat: chatSlice.reducer
});
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['shouldSetNewDoc', 'isRedirectResultNeeded', 'chat']
};
const persistedReducer = persistReducer(persistConfig, rootReducer);



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