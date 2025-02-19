import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify";

const initialState:any = [];


function removeAlert(id:any) {
    initialState.filter((alert:any) => alert.id !== id);
}

let nextAlertId = 0;

export const AlertStateSplice = createSlice({
    name:'AlertState',
    initialState,
    reducers:{

        addAlert: (state, action) => {

            const id = nextAlertId++;
            const { title, message, type } = action.payload;
            const duration = 1000
            switch (type){
                case "success":
                    toast.success(message, { autoClose: duration });
                    break
                case "error":
                    toast.error(message,{autoClose:duration})
                    break
                case "info":
                    toast.info(message, {autoClose:duration})
                    break
                case "warning":
                    toast.warning(message, {autoClose:duration})
                    break
                default:
                    alert(message)
                    break

            }

            setTimeout(() => {
                removeAlert(id);
            }, duration);

            return [
                ...state,
                { id, title, message, type }
            ]

        },

        cancelAlert: (state, action) => {
            const {id} = action.payload;
            const index = state.findIndex((alert:any) => alert.id === id);
            state.splice(index, 1);
        }


    }
});

export const { addAlert, cancelAlert } = AlertStateSplice.actions;
export default AlertStateSplice.reducer;
