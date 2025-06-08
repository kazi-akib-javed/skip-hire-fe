import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 