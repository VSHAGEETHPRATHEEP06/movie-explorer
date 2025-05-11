import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    movies: movieReducer,
    auth: authReducer,
    theme: themeReducer
  },
});

export default store;
