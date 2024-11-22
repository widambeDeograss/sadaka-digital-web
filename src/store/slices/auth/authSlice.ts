import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userInfo: null,
    error: "",
    success: false,
  };

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            console.log(action.payload);
            
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.success = true;
        },
        loginError(state, action) {
            state.error = action.payload.message;
            state.success = false;
        },
        setUserInfo(state, action){
            state.userInfo = action.payload
        },
        logoutSuccess(state, _action) {
            localStorage.removeItem('persist:root');
            state.isAuthenticated = false;
            state.accessToken = null;
            state.success = false;
            window.location.reload() ;
        }
    },
});

export const { loginSuccess, loginError, logoutSuccess, setUserInfo } = loginSlice.actions;
export default loginSlice.reducer;
