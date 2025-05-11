import { createSlice } from '@reduxjs/toolkit';

// Initial theme state
const initialState = {
  mode: localStorage.getItem('themeMode') || 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save theme preference to localStorage
      localStorage.setItem('themeMode', state.mode);
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      // Save theme preference to localStorage
      localStorage.setItem('themeMode', state.mode);
    }
  }
});

// Export actions
export const { toggleThemeMode, setThemeMode } = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;
