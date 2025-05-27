import { useState } from 'react';
import { Plus, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore } from '../../stores/collectionStore';

function CollectionSelector({ onSelectCollection, threadId, onClose }) {
  const { collections, addThreadToCollection, createCollection, isLoading } = useCollectionStore();
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [addingToCollection, setAddingToCollection] = useState(null);
  const [creatingCollection, setCreatingCollection] = useState(false);

  const handleAddToCollection = async (collectionId) => {
    setAddingToCollection(collectionId);
    const result = await addThreadToCollection(collectionId, threadId);
    setAddingToCollection(null);
    
    if (result.success) {
      onSelectCollection && onSelectCollection(collectionId);
      setTimeout(() => onClose && onClose(), 1000);
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    setCreatingCollection(true);
    const result = await createCollection({
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim()
    });
    
    if (result.success) {
      await handleAddToCollection(result.collectionId);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowNewCollection(false);
    }
    setCreatingCollection(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
    >
      <div className="p-4">
        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
          Add to Collection
        </h3>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {collections.length > 0 ? (
            collections.map((collection) => (
              <button
                key={collection._id}
                onClick={() => handleAddToCollection(collection._id)}
                disabled={addingToCollection === collection._id}
                className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-100 dark:border-neutral-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {collection.name}
                    </h4>
                    {collection.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1">
                        {collection.description}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      {collection.threads?.length || 0} threads
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {addingToCollection === collection._id ? (
                      <Loader className="w-4 h-4 animate-spin text-primary-600" />
                    ) : (
                      <Check className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
              <p className="text-sm">No collections yet</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-700">
          <AnimatePresence>
            {!showNewCollection ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNewCollection(true)}
                className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Collection
              </motion.button>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateAndAdd}
                className="space-y-3"
              >
                <input
                  type="text"
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!newCollectionName.trim() || creatingCollection}
                    className="flex-1 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingCollection ? (
                      <Loader className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      'Create & Add'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCollection(false)}
                    className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default CollectionSelector;
