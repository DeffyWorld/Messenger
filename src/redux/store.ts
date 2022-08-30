import { configureStore } from "@reduxjs/toolkit";

import { activeUserSlice } from "./slices/activeUserSlice";


const store = configureStore({
    reducer: {
        activeUser: activeUserSlice.reducer
    }
});


export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;