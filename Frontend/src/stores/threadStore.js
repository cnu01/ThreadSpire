import { create } from 'zustand';
import axios from 'axios';
import { API_URL, REACTION_TYPES } from '../utils/constants';
import { getAuthHeader } from '../utils/auth';

export const useThreadStore = create((set, get) => ({
  threads: [],
  thread: null,
  featuredThreads: [],
  userThreads: [],
  isLoading: false,
  error: null,
  filters: {
    tag: null,
    sort: 'popular',
  },

  // Fetch all threads with optional filters
  fetchThreads: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { tag, sort } = { ...get().filters, ...filters };
      const queryParams = new URLSearchParams();
      
      if (tag) queryParams.append('tag', tag);
      if (sort) queryParams.append('sort', sort);
      
      const response = await axios.get(
        `${API_URL}/threads?${queryParams.toString()}`
      );
      set({ 
        threads: response.data, 
        isLoading: false,
        filters: { ...get().filters, ...filters }
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch threads' 
      });
    }
  },

  // Fetch featured threads for homepage
  fetchFeaturedThreads: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { tag, sort } = { ...get().filters, ...filters };
      const queryParams = new URLSearchParams();
      if (tag) queryParams.append('tag', tag);
      if (sort) queryParams.append('sort', sort);
      const url = queryParams.toString()
        ? `${API_URL}/threads/featured?${queryParams.toString()}`
        : `${API_URL}/threads/featured`;
      const response = await axios.get(url);
      set({ featuredThreads: response.data, isLoading: false, filters: { ...get().filters, ...filters } });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch featured threads' 
      });
    }
  },

  // Fetch a single thread by ID
  fetchThread: async (threadId) => {
    set({ isLoading: true, error: null, thread: null });
    try {
      const response = await axios.get(`${API_URL}/threads/${threadId}`);
      set({ thread: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch thread' 
      });
      return null;
    }
  },

  // Fetch user's threads
  fetchUserThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/threads/user`, 
        getAuthHeader()
      );
      console.log('Fetched user threads:', response.data);
      set({ userThreads: response.data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch user threads' 
      });
    }
  },

  // Create a new thread
  createThread: async (threadData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/threads`, 
        threadData, 
        getAuthHeader()
      );
      
      set({ isLoading: false });
      return { success: true, threadId: response.data._id };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create thread' 
      });
      return { success: false, error: get().error };
    }
  },

  // Update an existing thread
  updateThread: async (threadId, threadData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(
        `${API_URL}/threads/${threadId}`, 
        threadData, 
        getAuthHeader()
      );
      
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update thread' 
      });
      return { success: false, error: get().error };
    }
  },

  // Add reaction to a segment
  addReaction: async (threadId, segmentId, reactionType) => {
    try {
      const response = await axios.post(
        `${API_URL}/threads/${threadId}/segments/${segmentId}/reactions`,
        { type: reactionType },
        getAuthHeader()
      );
      
      // Update the thread in state with the response data
      if (response.data) {
        set({ thread: response.data });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add reaction:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add reaction'
      };
    }
  },

  // Remove reaction from a segment
  removeReaction: async (threadId, segmentId, reactionId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/threads/${threadId}/segments/${segmentId}/reactions/${reactionId}`,
        getAuthHeader()
      );
      
      // Update the thread in state with the response data
      if (response.data) {
        set({ thread: response.data });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to remove reaction:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove reaction' 
      };
    }
  },

  // Fork a thread
  forkThread: async (threadId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/threads/${threadId}/fork`,
        {},
        getAuthHeader()
      );
      
      set({ isLoading: false });
      return { 
        success: true, 
        threadId: response.data._id 
      };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fork thread' 
      });
      return { success: false, error: get().error };
    }
  },

  // Publish a draft thread
  publishThread: async (threadId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/threads/${threadId}/publish`,
        {},
        getAuthHeader()
      );
      
      // Update the thread in userThreads
      const { userThreads } = get();
      const updatedUserThreads = userThreads.map(thread => 
        thread._id === threadId 
          ? { ...thread, isDraft: false }
          : thread
      );
      
      set({ 
        isLoading: false,
        userThreads: updatedUserThreads
      });
      
      return { success: true, thread: response.data };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to publish thread' 
      });
      return { success: false, error: get().error };
    }
  },

  // Delete a thread
  deleteThread: async (threadId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(
        `${API_URL}/threads/${threadId}`,
        getAuthHeader()
      );
      
      // Remove the thread from userThreads
      const { userThreads } = get();
      const updatedUserThreads = userThreads.filter(thread => thread._id !== threadId);
      
      set({ 
        isLoading: false,
        userThreads: updatedUserThreads
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete thread' 
      });
      return { success: false, error: get().error };
    }
  },
}));