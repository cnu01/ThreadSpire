import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getAuthHeader } from '../utils/auth';

export const useCollectionStore = create((set, get) => ({
  collections: [],
  collection: null,
  isLoading: false,
  error: null,

  // Fetch all collections for the current user
  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/collections`,
        getAuthHeader()
      );
      set({ collections: response.data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch collections' 
      });
    }
  },

  // Fetch a collection by ID
  fetchCollection: async (collectionId) => {
    set({ isLoading: true, error: null, collection: null });
    try {
      const response = await axios.get(
        `${API_URL}/collections/${collectionId}`,
        getAuthHeader()
      );
      set({ collection: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch collection' 
      });
      return null;
    }
  },

  // Create a new collection
  createCollection: async (collectionData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/collections`,
        collectionData,
        getAuthHeader()
      );
      
      // Add the new collection to the list
      const collections = [...get().collections, response.data];
      set({ collections, isLoading: false });
      
      return { success: true, collectionId: response.data._id };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create collection' 
      });
      return { success: false, error: get().error };
    }
  },

  // Update a collection
  updateCollection: async (collectionId, collectionData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/collections/${collectionId}`,
        collectionData,
        getAuthHeader()
      );
      
      // Update the collection in the list
      const collections = get().collections.map(c => 
        c._id === collectionId ? response.data : c
      );
      
      set({ 
        collections, 
        collection: response.data, 
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update collection' 
      });
      return { success: false, error: get().error };
    }
  },

  // Delete a collection
  deleteCollection: async (collectionId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(
        `${API_URL}/collections/${collectionId}`,
        getAuthHeader()
      );
      
      // Remove the collection from the list
      const collections = get().collections.filter(c => c._id !== collectionId);
      set({ collections, isLoading: false });
      
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete collection' 
      });
      return { success: false, error: get().error };
    }
  },

  // Add a thread to a collection
  addThreadToCollection: async (collectionId, threadId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/collections/${collectionId}/threads`,
        { threadId },
        getAuthHeader()
      );
      
      // Update the collection if it's currently loaded
      if (get().collection && get().collection._id === collectionId) {
        await get().fetchCollection(collectionId);
      }
      
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to add thread to collection' 
      });
      return { success: false, error: get().error };
    }
  },

  // Remove a thread from a collection
  removeThreadFromCollection: async (collectionId, threadId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(
        `${API_URL}/collections/${collectionId}/threads/${threadId}`,
        getAuthHeader()
      );
      
      // Update the collection if it's currently loaded
      if (get().collection && get().collection._id === collectionId) {
        const collection = { ...get().collection };
        collection.threads = collection.threads.filter(t => t._id !== threadId);
        set({ collection, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to remove thread from collection' 
      });
      return { success: false, error: get().error };
    }
  },
}));