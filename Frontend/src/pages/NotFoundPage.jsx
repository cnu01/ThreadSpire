import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-serif font-bold text-primary-600 dark:text-primary-400">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-serif font-bold text-neutral-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/"
            className="btn btn-primary flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;