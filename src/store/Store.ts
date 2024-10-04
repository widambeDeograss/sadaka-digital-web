import {configureStore} from "@reduxjs/toolkit";
import AppStateReducer from "./slices/AppState-slice.ts";
import authSlice from "./slices/auth/authSlice.ts";
import alertSlice from "./slices/alert/alertSlice.ts";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
  };

  const rootReducer = combineReducers({
    app: AppStateReducer,
    alert: alertSlice,
    user: authSlice
});
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    devTools:true,
  });

  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatcher = typeof store.dispatch;
  export const persistor = persistStore(store);
