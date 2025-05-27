import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useCollectionStore } from '../stores/collectionStore';
import { formatRelativeDate } from '../utils/helpers';
import ThreadCard from '../components/thread/ThreadCard';

function CollectionDetailPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { 
    collection, 
    fetchCollection, 
    updateCollection,
    deleteCollection,
    removeThreadFromCollection,
    isLoading, 
    error 
  } = useCollectionStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [removeThreadId, setRemoveThreadId] = useState(null);
  
  useEffect(() => {
    fetchCollection(collectionId);
  }, [collectionId, fetchCollection]);
  
  const handleDeleteCollection = async () => {
    setDeleteLoading(true);
    
    const result = await deleteCollection(collectionId);
    
    if (result.success) {
      navigate('/collections');
    } else {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };
  
  const handleRemoveThread = async (threadId) => {
    setRemoveThreadId(threadId);
    
    await removeThreadFromCollection(collectionId, threadId);
    
    setRemoveThreadId(null);
  };
  
  // If loading
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading collection...</p>
      </div>
    );
  }
  
  // If error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-800 dark:text-error-200 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to load collection: {error}</span>
          </div>
        </div>
        
        <Link to="/collections" className="btn btn-outline mt-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }
  
  // If collection not found
  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">Collection not found</p>
        <Link to="/collections" className="btn btn-outline mt-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/collections" className="inline-flex items-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to collections
      </Link>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">
              {collection.name}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Created {formatRelativeDate(collection.createdAt)}
            </p>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to={`/collections/${collectionId}/edit`}
              className="btn btn-outline flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-outline text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        
        {collection.description && (
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            {collection.description}
          </p>
        )}
      </div>
      
      <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-6">
        Threads in this Collection
      </h2>
      
      {collection.threads && collection.threads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collection.threads.map((thread, index) => (
            <div key={thread._id} className="relative">
              <button
                onClick={() => handleRemoveThread(thread._id)}
                disabled={removeThreadId === thread._id}
                className="absolute right-3 top-3 z-10 bg-white dark:bg-neutral-800 rounded-full p-1 text-neutral-500 hover:text-error-600 dark:text-neutral-400 dark:hover:text-error-400 transition-colors"
                aria-label="Remove thread from collection"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <ThreadCard thread={thread} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
            No threads in this collection
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            Browse threads and bookmark them to add to this collection
          </p>
          <Link to="/" className="btn btn-primary">
            Explore threads
          </Link>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
              Delete Collection
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6">
              Are you sure you want to delete this collection? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCollection}
                className="btn btn-primary bg-error-600 hover:bg-error-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionDetailPage;