import { createSlice } from "@reduxjs/toolkit";
import { appState, appStateInterface } from "../utilities/interfaces";

const initialState:appStateInterface = appState;

const getInitialThemeMode = () => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true; // Dark mode
    } else {
      return false; // Light mode
    }
  };

  const initialThemeMode = getInitialThemeMode();

  initialState.isDarkMode = initialThemeMode;

export const AppStateSlice = createSlice({
    name:'AppState',
    initialState,
    reducers:{
        togglePageLoading:(state) => {
            state.isPageLoading = !state.isPageLoading;
        },
        toggleThemeMode:(state) => {
            state.isDarkMode = !state.isDarkMode;
        },
        setAuthentication:(state, action) => {
          const {payload} = action;
          state.isUserAuthenticated = payload;
        },
        toggleAlert: (state) => {
            state.alertState = !state.alertState
        },
        displayAlert: (state, {payload}) => {
            state.alertMessage = payload.message;
            let severity = '';
            switch(payload.severity){
                case 'success':
                    severity = 'success';
                    break;
                case 'warning':
                    severity = 'warning';
                    break;
                case 'failed':
                    severity = 'error';
                    break;
                case 'error':
                    severity = 'error';
                    break;
                default:
                    severity = 'primary'

            }
            state.severity = severity;
        }
    }
});

export const {togglePageLoading, toggleThemeMode, setAuthentication, toggleAlert, displayAlert } = AppStateSlice.actions;
export default AppStateSlice.reducer;
