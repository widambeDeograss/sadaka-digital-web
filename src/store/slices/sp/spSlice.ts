// src/store/slices/currentSPSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface Package {
  id: number;
  package_name: string;
  package_description: string;
  package_price: string;
  package_duration: string;
  is_active: boolean;
  payed_amount: number;
  package_start_date: string;
  package_end_date: string;
}

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
  active_package?: Package | null; 
}

const initialState: ServiceProvider | null = null;

const currentSPSlice = createSlice({
  name: 'sp',
  initialState,
  reducers: {
    setCurrentSP(_state, action){
      return action.payload;
    },
    setActivePackage(state:any, action) {
      if (state) {
        state.active_package = action.payload;
      }
    },
    clearActivePackage(state:any) {
      if (state) {
        state.active_package = null;
      }
    },
    // updateCurrentSP(state, action) {
    //     state = { ...state, ...action.payload };
    // },
    clearCurrentSP: () => {
      return null;
    },
  },
});

export const { setCurrentSP, clearCurrentSP, setActivePackage, clearActivePackage } = currentSPSlice.actions;

export default currentSPSlice.reducer;
