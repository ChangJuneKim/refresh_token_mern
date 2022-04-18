import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: [],
  isLogged: false,
  isAdmin: false,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: state => {
      state.isLogged = true;
    },

    logout: state => {
      Object.assign(state, initialState);
    },

    getToken: (state, action) => {
      state.token = action.payload;
    },

    getUser: (state, action) => {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin === 1 ? true : false;
    },
  },
});

export const { login, logout, getToken, getUser } = authSlice.actions;

export default authSlice.reducer;
