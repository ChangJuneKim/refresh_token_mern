import { configureStore } from '@reduxjs/toolkit';
import { snackReducer } from './slices';

const store = configureStore({
  reducer: {
    snackBar: snackReducer,
  },
});

export default store;
