import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../utils/constants';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth from local storage
  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return set({ isAuthenticated: false, user: null });
    }

    try {
      // Check if token is expired
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        return set({ isAuthenticated: false, user: null });
      }

      // Set authentication state
      set({ 
        isAuthenticated: true, 
        user: {
          _id: decoded.id,
          id: decoded.id,
          email: decoded.email,
          username: decoded.username
        } 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null });
    }
  },

  // Register a new user
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      set({ 
        isAuthenticated: true, 
        user, 
        isLoading: false 
      });

      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      return { success: false, error: get().error };
    }
  },

  // Login a user
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      set({ 
        isAuthenticated: true, 
        user, 
        isLoading: false 
      });

      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      return { success: false, error: get().error };
    }
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null });
  },
}));