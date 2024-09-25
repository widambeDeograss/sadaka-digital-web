import {configureStore} from "@reduxjs/toolkit";
import AppStateReducer from "./slices/AppState-slice.ts";

const store = configureStore({
    reducer:{
        AppStateReducer:AppStateReducer
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatcher = typeof store.dispatch;
