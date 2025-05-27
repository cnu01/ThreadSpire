import { Link } from 'react-router-dom';
import { ArrowLeft, Book } from 'lucide-react';
import CollectionForm from '../components/collection/CollectionForm';

function CreateCollectionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/collections" 
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors group mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
              Create New Collection
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Organize your favorite threads into a collection
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
        <CollectionForm />
      </div>
    </div>
  );
}

export default CreateCollectionPage;
