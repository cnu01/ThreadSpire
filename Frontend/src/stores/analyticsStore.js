import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getAuthHeader } from '../utils/auth';

export const useAnalyticsStore = create((set) => ({
  analytics: null,
  isLoading: false,
  error: null,

  // Fetch user analytics
  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/analytics`,
        getAuthHeader()
      );
      set({ analytics: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch analytics' 
      });
      return null;
    }
  },

  // Fetch thread-specific analytics
  fetchThreadAnalytics: async (threadId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/analytics/threads/${threadId}`,
        getAuthHeader()
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch thread analytics' 
      });
      return null;
    }
  },
}));