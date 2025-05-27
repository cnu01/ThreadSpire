import { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Book, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore } from '../../stores/collectionStore';

function CollectionManagementModal({ isOpen, onClose, threadId }) {
  const { 
    collections, 
    fetchCollections, 
    createCollection, 
    updateCollection, 
    deleteCollection,
    addThreadToCollection,
    removeThreadFromCollection,
    isLoading 
  } = useCollectionStore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [processingCollections, setProcessingCollections] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen, fetchCollections]);

  const isThreadInCollection = (collection) => {
    return collection.threads?.some(thread => thread._id === threadId);
  };

  const handleToggleThreadInCollection = async (collection) => {
    const collectionId = collection._id;
    setProcessingCollections(prev => new Set(prev).add(collectionId));
    
    try {
      if (isThreadInCollection(collection)) {
        await removeThreadFromCollection(collectionId, threadId);
      } else {
        await addThreadToCollection(collectionId, threadId);
      }
      // Refresh collections to get updated data
      await fetchCollections();
    } catch (error) {
      console.error('Error toggling thread in collection:', error);
    } finally {
      setProcessingCollections(prev => {
        const newSet = new Set(prev);
        newSet.delete(collectionId);
        return newSet;
      });
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollection.name.trim()) return;
    
    const result = await createCollection(newCollection);
    if (result.success) {
      setNewCollection({ name: '', description: '' });
      setShowCreateForm(false);
      await fetchCollections();
    }
  };

  const handleUpdateCollection = async (e) => {
    e.preventDefault();
    if (!editingCollection || !editingCollection.name.trim()) return;
    
    const result = await updateCollection(editingCollection._id, {
      name: editingCollection.name,
      description: editingCollection.description
    });
    
    if (result.success) {
      setEditingCollection(null);
      await fetchCollections();
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      const result = await deleteCollection(collectionId);
      if (result.success) {
        await fetchCollections();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-neutral-200 dark:border-neutral-700"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Book className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Manage Collections
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="p-4">
            {/* Create Collection Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-primary-600 dark:text-primary-400 border-2 border-dashed border-primary-300 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Collection
              </button>
            </div>

            {/* Create Collection Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateCollection}
                  className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-600"
                >
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Collection name"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      autoFocus
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newCollection.description}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!newCollection.name.trim() || isLoading}
                        className="flex-1 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Collections List */}
            <div className="space-y-3">
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <div
                    key={collection._id}
                    className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-600"
                  >
                    {editingCollection?._id === collection._id ? (
                      <form onSubmit={handleUpdateCollection} className="space-y-3">
                        <input
                          type="text"
                          value={editingCollection.name}
                          onChange={(e) => setEditingCollection(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                        <textarea
                          value={editingCollection.description}
                          onChange={(e) => setEditingCollection(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCollection(null)}
                            className="px-3 py-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                            {collection.name}
                          </h3>
                          {collection.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {collection.description}
                            </p>
                          )}
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                            {collection.threads?.length || 0} threads
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isThreadInCollection(collection)}
                              onChange={() => handleToggleThreadInCollection(collection)}
                              disabled={processingCollections.has(collection._id)}
                              className="w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                            />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              {processingCollections.has(collection._id) ? 'Updating...' : 'Include'}
                            </span>
                          </label>
                          
                          <button
                            onClick={() => setEditingCollection(collection)}
                            className="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCollection(collection._id)}
                            className="p-1 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No collections yet</p>
                  <p className="text-xs mt-1">Create your first collection to organize your bookmarked threads</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CollectionManagementModal;
