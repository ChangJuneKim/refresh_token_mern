import { configureStore } from '@reduxjs/toolkit';
import { snackReducer, authReducer } from './slices';

const store = configureStore({
  reducer: {
    snackBar: snackReducer,
    auth: authReducer,
  },
});

export default store;
