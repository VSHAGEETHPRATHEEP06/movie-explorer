import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      // Save user to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Remove user from localStorage
      localStorage.removeItem('user');
    },
    loadUser: (state) => {
      const user = localStorage.getItem('user');
      if (user) {
        state.isAuthenticated = true;
        state.user = JSON.parse(user);
      }
    }
  }
});

export const { loginRequest, loginSuccess, loginFailure, logout, loadUser } = authSlice.actions;

// Async login action
export const login = (credentials) => (dispatch) => {
  dispatch(loginRequest());
  
  // Return a Promise that resolves or rejects based on the login result
  return new Promise((resolve, reject) => {
    try {
      // For this app, we'll use a mock login since we don't have a real backend
      // In a real app, you would make an API call here
      if (credentials.username && credentials.password) {
        // Simulate network delay
        setTimeout(() => {
          const user = {
            username: credentials.username,
            // Don't store the actual password in the state
            name: `User ${credentials.username}`
          };
          dispatch(loginSuccess(user));
          resolve(user);
        }, 1000);
      } else {
        const errorMsg = 'Username and password are required';
        dispatch(loginFailure(errorMsg));
        reject(new Error(errorMsg));
      }
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      dispatch(loginFailure(errorMsg));
      reject(new Error(errorMsg));
    }
  });
};

export default authSlice.reducer;
