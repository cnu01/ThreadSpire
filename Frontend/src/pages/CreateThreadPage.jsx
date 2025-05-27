import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, GitFork } from 'lucide-react';
import { useThreadStore } from '../stores/threadStore';
import ThreadEditor from '../components/thread/ThreadEditor';

function CreateThreadPage() {
  const { threadId } = useParams();
  const location = useLocation();
  const { thread, fetchThread, isLoading, error } = useThreadStore();
  const [existingThread, setExistingThread] = useState(null);
  
  const isEditMode = !!threadId;
  const isRemix = location.state?.isRemix;
  const originalAuthor = location.state?.originalAuthor;

  console.log('CreateThreadPage loaded with:',location.state)
  
  // Force dark mode for writing
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Store current theme
    const currentTheme = localStorage.getItem('theme');
    const wasDark = root.classList.contains('dark');
    
    // Apply dark mode
    root.classList.add('dark');
    body.classList.add('dark');
    
    // Cleanup function to restore theme when leaving
    return () => {
      if (!wasDark && currentTheme !== 'dark') {
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
    };
  }, []);
  
  // Fetch thread if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchThread(threadId).then(result => {
        if (result) {
          setExistingThread(result);
        }
      });
    }
  }, [isEditMode, threadId, fetchThread]);
  
  // If loading in edit mode
  if (isEditMode && isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading thread...</p>
      </div>
    );
  }
  
  // If error in edit mode
  if (isEditMode && error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-800 dark:text-error-200 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to load thread: {error}</span>
          </div>
        </div>
        
        <Link to="/" className="btn btn-outline mt-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Dark mode indicator */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            {/* <Moon className="h-4 w-4" /> */}
            {/* <span>Writing mode (Dark theme optimized)</span> */}
             <Link 
            to="/" 
            className="inline-flex items-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel and go back
          </Link>
          </div>
         
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          {isRemix && originalAuthor && (
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <GitFork className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">
                  Remixing thread inspired by {originalAuthor}
                </p>
                <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                  When you publish, attribution will be automatically added to your thread.
                </p>
              </div>
            </div>
          )}
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {isEditMode ? (isRemix ? 'Remix Thread' : 'Edit Thread') : 'Create New Thread'}
          </h1>
        </div>
        
        <ThreadEditor existingThread={existingThread} />
      </div>
    </div>
  );
}

export default CreateThreadPage;