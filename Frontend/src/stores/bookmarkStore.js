import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getAuthHeader } from '../utils/auth';

export const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  isLoading: false,
  error: null,

  // Fetch all bookmarks for the current user
  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/bookmarks`,
        getAuthHeader()
      );
      set({ bookmarks: response.data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch bookmarks' 
      });
    }
  },

  // Add a bookmark
  addBookmark: async (threadId) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Adding bookmark for thread:', threadId);
      const response = await axios.post(
        `${API_URL}/bookmarks`,
        { threadId },
        getAuthHeader()
      );
      
      console.log('Bookmark added successfully:', response.data);
      
      // Add the new bookmark to the list
      const bookmarks = [...get().bookmarks, response.data];
      set({ bookmarks, isLoading: false });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding bookmark:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to add bookmark' 
      });
      return { success: false, error: get().error };
    }
  },

  // Remove a bookmark
  removeBookmark: async (threadId) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Removing bookmark for thread:', threadId);
      await axios.delete(
        `${API_URL}/bookmarks/${threadId}`,
        getAuthHeader()
      );
      
      console.log('Bookmark removed successfully');
      
      // Remove the bookmark from the list using thread ID
      const bookmarks = get().bookmarks.filter(b => b.thread._id !== threadId);
      set({ bookmarks, isLoading: false });
      
      return { success: true };
    } catch (error) {
      console.error('Error removing bookmark:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to remove bookmark' 
      });
      return { success: false, error: get().error };
    }
  },

  // Check if a thread is bookmarked
  isThreadBookmarked: (threadId) => {
    return get().bookmarks.some(bookmark => bookmark.thread && bookmark.thread._id === threadId);
  },

  // Get bookmark ID for a thread (now returns thread ID since we use thread ID as bookmark ID)
  getBookmarkId: (threadId) => {
    const bookmark = get().bookmarks.find(b => b.thread && b.thread._id === threadId);
    return bookmark ? threadId : null;
  },
}));