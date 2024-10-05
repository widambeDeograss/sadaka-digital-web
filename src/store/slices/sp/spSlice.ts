// src/store/slices/currentSPSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface ServiceProvider {
  church_name: string;
  church_location: string;
  church_email: string;
  church_phone: string;
  church_category: string;
  church_status: boolean;
  inserted_by: string;
  sp_admin: string;
  updated_by: string;
}

const initialState: ServiceProvider | null = null;

const currentSPSlice = createSlice({
  name: 'sp',
  initialState,
  reducers: {
    setCurrentSP(state, action){
      return action.payload;
    },
    // updateCurrentSP(state, action) {
    //     state = { ...state, ...action.payload };
    // },
    clearCurrentSP: () => {
      return null;
    },
  },
});

export const { setCurrentSP, clearCurrentSP } = currentSPSlice.actions;

export default currentSPSlice.reducer;
