import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { 
  BookmarkPlus, 
  BookmarkCheck, 
  Share2, 
  Copy, 
  Edit, 
  ArrowLeft, 
  AlertCircle,
  UserCircle,
  GitFork,
  Calendar,
  FolderOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useThreadStore } from '../stores/threadStore';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useCollectionStore } from '../stores/collectionStore';
import ThreadSegment from '../components/thread/ThreadSegment';
import CollectionSelector from '../components/collection/CollectionSelector';
import CollectionManagementModal from '../components/collection/CollectionManagementModal';
import RemixModal from '../components/thread/RemixModal';
import { formatDate, formatRelativeDate } from '../utils/helpers';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { thread, fetchThread, forkThread, isLoading, error } = useThreadStore();
  const { 
    addBookmark, 
    removeBookmark, 
    isThreadBookmarked, 
    getBookmarkId,
    fetchBookmarks
  } = useBookmarkStore();
  const { collections, fetchCollections, addThreadToCollection } = useCollectionStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [showCollections, setShowCollections] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [forking, setForking] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [showCollectionManagement, setShowCollectionManagement] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();
  const segmentRefs = useRef({});
  
  // Set up intersection observer for segments
  const [ref, inView] = useInView({
    threshold: 0.5,
  });
  
  // Fetch thread on component mount
  useEffect(() => {
    fetchThread(threadId);
    
    if (isAuthenticated) {
      fetchCollections();
      fetchBookmarks(); // Fetch bookmarks to ensure we have the latest state
    }
  }, [threadId, fetchThread, isAuthenticated, fetchCollections, fetchBookmarks]);
  
  // Check if thread is bookmarked
  useEffect(() => {
    if (isAuthenticated && thread) {
      setIsBookmarked(isThreadBookmarked(thread._id));
      setBookmarkId(getBookmarkId(thread._id));
    }
  }, [isAuthenticated, thread, isThreadBookmarked, getBookmarkId]);
  
  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (isBookmarked) {
      await removeBookmark(thread._id); // Use thread ID directly
      setIsBookmarked(false);
      setBookmarkId(null);
    } else {
      const result = await addBookmark(thread._id);
      if (result.success) {
        setIsBookmarked(true);
        setBookmarkId(thread._id); // Use thread ID as bookmark ID
        setShowCollections(true);
      }
    }
  };
  
  // Add thread to collection
  const handleAddToCollection = async (collectionId) => {
    setAddingToCollection(true);
    
    const result = await addThreadToCollection(collectionId, thread._id);
    
    if (result.success) {
      // Show success feedback
      setTimeout(() => {
        setShowCollections(false);
      }, 1500);
    }
    
    setAddingToCollection(false);
  };
  
  // Fork thread
  const handleForkThread = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    setShowRemixModal(true);
  };
  
  // Share thread
  const handleShareThread = () => {
    if (navigator.share) {
      navigator.share({
        title: thread.title,
        text: `Check out this thread: ${thread.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  // Scroll to segment
  const scrollToSegment = (segmentId) => {
    setActiveSegmentId(segmentId);
    segmentRefs.current[segmentId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };
  
  // If loading
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading thread...</p>
      </div>
    );
  }
  
  // If error
  if (error) {
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
  
  // If thread not found
  if (!thread) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">Thread not found</p>
        <Link to="/" className="btn btn-outline mt-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Back navigation - compact */}
        <div className="mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to threads
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Segment navigation sidebar - compact */}
          <aside className="lg:col-span-3">
            <div className="sticky top-4">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="p-3 border-b border-neutral-100 dark:border-neutral-700">
                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                    Navigation
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {thread.segments?.length || 0} segments
                  </p>
                </div>
                
                <nav className="p-2 max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    {thread.segments?.map((segment, index) => (
                      <button
                        key={segment._id}
                        onClick={() => scrollToSegment(segment._id)}
                        className={`w-full text-left p-2 rounded-md transition-all duration-200 ${
                          activeSegmentId === segment._id
                            ? 'bg-primary-50 border-l-2 border-primary-500 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-400'
                            : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-600 text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium line-clamp-2">
                              {segment.content.replace(/<[^>]*>/g, '').substring(0, 40)}
                              {segment.content.length > 40 && '...'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </aside>
          
          {/* Main content - compact */}
          <main className="lg:col-span-9">
            <article className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              {/* Header section - compact */}
              <header className="p-6 border-b border-neutral-100 dark:border-neutral-700">
                {/* Thread title - smaller */}
                <div className="mb-4">
                  {thread.originalThread && (
                    <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 mb-2">
                      <GitFork className="w-4 h-4" />
                      <span>
                        Inspired by{' '}
                        <Link 
                          to={`/thread/${thread.originalThread._id}`}
                          className="font-medium hover:underline"
                        >
                          {thread.originalThread.author?.username || 'Unknown'}
                        </Link>
                      </span>
                    </div>
                  )}
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
                    {thread.title}
                  </h1>
                </div>
                
                {/* Author and metadata - compact */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={thread.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.author?.username)}&background=random&size=64`}
                      alt={thread.author?.username}
                      className="w-6 h-6 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-600"
                    />
                    <div>
                      <div className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">
                        {thread.author?.username || 'Anonymous'}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        {formatDate(thread.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons - compact */}
                  <div className="flex items-center gap-2 ml-auto relative">
                    <button
                      onClick={handleForkThread}
                      disabled={forking}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50"
                    >
                      <GitFork className="h-3 w-3" />
                      Remix
                      {thread.forkCount > 0 && (
                        <span className="ml-1 text-xs text-neutral-500">
                          ({thread.forkCount})
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={handleShareThread}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors rounded hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                      {copySuccess ? <Copy className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
                      {copySuccess ? 'Copied!' : 'Share'}
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={handleBookmarkToggle}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors rounded hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <BookmarkPlus className="h-3 w-3" />
                        )}
                        {isBookmarked ? 'Saved' : 'Save'}
                        {thread.bookmarks?.length > 0 && (
                          <span className="ml-1 text-xs text-neutral-500">
                            ({thread.bookmarks.length})
                          </span>
                        )}
                      </button>
                      
                      {/* Collection Selector */}
                      {showCollections && isAuthenticated && (
                        <CollectionSelector
                          threadId={thread._id}
                          onSelectCollection={() => {}}
                          onClose={() => setShowCollections(false)}
                        />
                      )}
                    </div>
                    
                    {/* Collection Management button for authenticated users */}
                    {isAuthenticated && (
                      <button
                        onClick={() => setShowCollectionManagement(true)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors rounded hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        title="Manage Collections"
                      >
                        <FolderOpen className="h-3 w-3" />
                        Collections
                      </button>
                    )}
                    
                    {/* Edit button for author */}
                    {isAuthenticated && user?._id === thread.author?._id && (
                      <Link
                        to={`/edit/${thread._id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors rounded hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Color-coded tags - compact */}
                {thread.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {thread.tags.map((tag, index) => {
                      const colors = [
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
                        'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
                        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
                        'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
                        'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800',
                        'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800'
                      ];
                      const colorClass = colors[index % colors.length];
                      
                      return (
                        <span 
                          key={tag}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </header>
              
              {/* Thread content - compact */}
              <div className="p-6">
                <div className="prose prose-base dark:prose-invert max-w-none">
                  {thread.segments?.map((segment, index) => (
                    <div 
                      key={segment._id} 
                      ref={el => segmentRefs.current[segment._id] = el}
                      className={`scroll-mt-16 mb-8 ${
                        activeSegmentId === segment._id 
                          ? 'ring-1 ring-primary-500/30 ring-offset-2 ring-offset-white dark:ring-offset-neutral-800 rounded-md p-3 -m-3' 
                          : ''
                      }`}
                    >
                      <ThreadSegment 
                        segment={segment} 
                        segmentIndex={index} 
                        threadId={thread._id}
                        isAuthor={user?._id === thread.author?._id}
                        isAuthenticated={isAuthenticated}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Fork This Thread CTA */}
                {isAuthenticated && user?._id !== thread.author?._id && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                          Inspired by this thread?
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          Fork this thread to create your own version. Edit, add segments, and make it yours!
                        </p>
                      </div>
                      <button
                        onClick={handleForkThread}
                        disabled={forking}
                        className="ml-4 btn btn-primary flex items-center gap-2 whitespace-nowrap"
                      >
                        <GitFork className="w-4 h-4" />
                        {forking ? 'Forking...' : 'Fork This Thread'}
                        {thread.forkCount > 0 && (
                          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                            {thread.forkCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
            
            {/* Related Threads Section */}
            {thread.relatedThreads && thread.relatedThreads.length > 0 && (
              <section className="mt-8">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
                    <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                      Related Threads
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Other threads with similar tags
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {thread.relatedThreads.map((relatedThread) => (
                        <Link
                          key={relatedThread._id}
                          to={`/thread/${relatedThread._id}`}
                          className="group p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                              {relatedThread.title}
                            </h3>
                            {relatedThread.forkCount > 0 && (
                              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                                <GitFork className="w-3 h-3" />
                                <span>{relatedThread.forkCount}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                            <img
                              src={relatedThread.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(relatedThread.author?.username)}&background=random&size=32`}
                              alt={relatedThread.author?.username}
                              className="w-4 h-4 rounded-full"
                            />
                            <span>{relatedThread.author?.username}</span>
                            <span>·</span>
                            <span>{formatRelativeDate(relatedThread.createdAt)}</span>
                          </div>
                          
                          {/* Preview of first segment */}
                          {relatedThread.segments && relatedThread.segments[0] && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                              {relatedThread.segments[0].content.replace(/<[^>]*>/g, '').substring(0, 120)}
                              {relatedThread.segments[0].content.length > 120 && '...'}
                            </p>
                          )}
                          
                          {/* Tags */}
                          {relatedThread.tags && relatedThread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {relatedThread.tags.slice(0, 3).map((tag, index) => {
                                const colors = [
                                  'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                                  'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                                  'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                                ];
                                const colorClass = colors[index % colors.length];
                                
                                return (
                                  <span 
                                    key={tag}
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                                  >
                                    {tag}
                                  </span>
                                );
                              })}
                              {relatedThread.tags.length > 3 && (
                                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                                  +{relatedThread.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      
      {/* Remix Modal */}
      <RemixModal
        isOpen={showRemixModal}
        onClose={() => setShowRemixModal(false)}
        thread={thread}
      />
      
      {/* Collection Management Modal */}
      <CollectionManagementModal
        isOpen={showCollectionManagement}
        onClose={() => setShowCollectionManagement(false)}
        threadId={thread._id}
      />
    </div>
  );
}

export default ThreadDetailPage;