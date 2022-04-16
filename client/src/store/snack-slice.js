import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visible: false,
  message: '',
  type: '',
};

export const snackSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    openSnackBar: (state, action) => {
      state.visible = true;
      state.message = action.payload.msg;
      state.type = action.payload.type;
    },

    closeSnackBar: state => {
      state.visible = false;
      state.message = '';
      state.type = '';
    },
  },
});

export const { openSnackBar, closeSnackBar } = snackSlice.actions;

export default snackSlice.reducer;
