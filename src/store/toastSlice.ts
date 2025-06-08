import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  message: string;
  isVisible: boolean;
}

const initialState: ToastState = {
  message: '',
  isVisible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.isVisible = true;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = ''; // Clear message on hide
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer; 