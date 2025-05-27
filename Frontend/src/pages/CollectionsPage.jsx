import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, GitFork } from 'lucide-react';
import { useCollectionStore } from '../stores/collectionStore';
import CollectionCard from '../components/collection/CollectionCard';

function CollectionsPage() {
  const { collections, fetchCollections, isLoading } = useCollectionStore();
  
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
          Your Collections
        </h1>
        
        <Link to="/collections/new" className="btn btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Collection
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading collections...</p>
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <CollectionCard key={collection._id} collection={collection} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <GitFork className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
            No collections yet
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            Create collections to organize your favorite threads
          </p>
          <Link to="/collections/new" className="btn btn-primary">
            Create your first collection
          </Link>
        </div>
      )}
    </div>
  );
}

export default CollectionsPage;