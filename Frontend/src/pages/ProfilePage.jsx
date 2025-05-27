import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, BookOpen, BookmarkIcon, GitFork, Plus, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThreadStore } from '../stores/threadStore';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useCollectionStore } from '../stores/collectionStore';
import ThreadCard from '../components/thread/ThreadCard';
import CollectionCard from '../components/collection/CollectionCard';

function ProfilePage() {
  const { user } = useAuthStore();
  const { userThreads, fetchUserThreads, isLoading: threadsLoading } = useThreadStore();
  const { bookmarks, fetchBookmarks, isLoading: bookmarksLoading } = useBookmarkStore();
  const { collections, fetchCollections, isLoading: collectionsLoading } = useCollectionStore();
  const [activeTab, setActiveTab] = useState('threads');
  
  console.log('User Threads:', bookmarks);
  // Fetch user data on component mount
  useEffect(() => {
    fetchUserThreads();
    fetchBookmarks();
    fetchCollections();
  }, [fetchUserThreads, fetchBookmarks, fetchCollections]);
  
  // Filter threads by published/draft
  const publishedThreads = userThreads.filter(thread => !thread.isDraft);
  const draftThreads = userThreads.filter(thread => thread.isDraft);

  // Fallback values for user data
  const displayUsername = user?.username || 'Anonymous User';
  const displayEmail = user?.email || 'No email provided';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start -mt-16 md:-mt-12">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUsername)}&background=3b82f6&color=ffffff&size=128`}
                alt={displayUsername}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-neutral-800 shadow-lg bg-white"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-success-500 border-2 border-white dark:border-neutral-800 rounded-full"></div>
            </div>
            <div className="text-center md:text-left mt-4 md:mt-8 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                    {displayUsername}
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    {displayEmail}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {publishedThreads.length} Published
                    </span>
                    <span className="flex items-center">
                      <Pencil className="h-4 w-4 mr-1" />
                      {draftThreads.length} Drafts
                    </span>
                    <span className="flex items-center">
                      <BookmarkIcon className="h-4 w-4 mr-1" />
                      {bookmarks.length} Bookmarks
                    </span>
                    <span className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {collections.length} Collections
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-3">
                  <Link 
                    to="/create" 
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Create Thread
                  </Link>
                  <Link 
                    to="/collections/new" 
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Collection
                  </Link>
                  <Link 
                    to="/analytics" 
                    className="inline-flex items-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('threads')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'threads'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <BookOpen className="h-5 w-5 inline mr-2" />
            My Threads
          </button>
          
          <button
            onClick={() => setActiveTab('drafts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'drafts'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Pencil className="h-5 w-5 inline mr-2" />
            Drafts
          </button>
          
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookmarks'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <BookmarkIcon className="h-5 w-5 inline mr-2" />
            Bookmarks
          </button>
          
          <button
            onClick={() => setActiveTab('collections')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'collections'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <GitFork className="h-5 w-5 inline mr-2" />
            Collections
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div>
        {/* My Threads tab */}
        {activeTab === 'threads' && (
          <div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-6">
              Published Threads
            </h2>
            
            {threadsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading your threads...</p>
              </div>
            ) : publishedThreads.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {publishedThreads.map((thread, index) => (
                  <ThreadCard key={thread._id} thread={thread} index={index} showActions={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  No published threads yet
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Start creating and publishing your wisdom threads
                </p>
                <Link to="/create" className="btn btn-primary">
                  Create your first thread
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Drafts tab */}
        {activeTab === 'drafts' && (
          <div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-6">
              Draft Threads
            </h2>
            
            {threadsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading your drafts...</p>
              </div>
            ) : draftThreads.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {draftThreads.map((thread, index) => (
                  <ThreadCard key={thread._id} thread={thread} index={index} showActions={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <Pencil className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  No draft threads
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  You don't have any drafts saved yet
                </p>
                <Link to="/create" className="btn btn-primary">
                  Start a new thread
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Bookmarks tab */}
        {activeTab === 'bookmarks' && (
          <div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-6">
              Your Bookmarks
            </h2>
            
            {bookmarksLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading your bookmarks...</p>
              </div>
            ) : bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bookmarks.map((bookmark, index) => (
                  <div>
                    {console.log('Bookmark:', bookmark)}
                  <ThreadCard key={bookmark?._id} thread={bookmark?.thread} index={index} />
              </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <BookmarkIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Bookmark threads you find valuable to access them later
                </p>
                <Link to="/" className="btn btn-primary">
                  Explore threads
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Collections tab */}
        {activeTab === 'collections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                Your Collections
              </h2>
              
              <Link to="/collections/new" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Link>
            </div>
            
            {collectionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading your collections...</p>
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
        )}
      </div>
    </div>
  );
}

export default ProfilePage;