import { Link } from 'react-router-dom';
import { Book, Heading as Thread } from 'lucide-react';
import { formatRelativeDate } from '../../utils/helpers';

function CollectionCard({ collection }) {
  return (
    <Link to={`/collections/${collection._id}`}>
      <article className="card p-6 mb-6 hover:transform hover:scale-[1.01] transition-all duration-200">
        <header className="mb-4">
          <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center">
            <Book className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            {collection.name}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Created {formatRelativeDate(collection.createdAt)}
          </p>
        </header>
        
        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
          {collection.description || 'No description provided.'}
        </p>
        
        <footer className="flex items-center text-neutral-500 dark:text-neutral-400">
          <Thread className="h-4 w-4 mr-1" />
          <span>
            {collection.threadCount || collection.threads?.length || 0} threads
          </span>
        </footer>
      </article>
    </Link>
  );
}

export default CollectionCard;