import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { BookmarkPlus, BookmarkCheck, FileText, Heart, GitFork, Upload, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useThreadStore } from '../../stores/threadStore';
import { formatRelativeDate, truncateText } from '../../utils/helpers';

function ThreadCard({ thread, index, showActions = false }) {
  const { isAuthenticated, user } = useAuthStore();
  const { addBookmark, removeBookmark, isThreadBookmarked, getBookmarkId } = useBookmarkStore();
  const { publishThread, deleteThread } = useThreadStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Helper function to count total reactions across all segments
  const getTotalReactions = () => {
    if (!thread.segments) return 0;
    return thread.segments.reduce((total, segment) => {
      return total + (segment.reactions?.length || 0);
    }, 0);
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      setIsBookmarked(isThreadBookmarked(thread?._id));
      setBookmarkId(getBookmarkId(thread?._id));
    }
  }, [isAuthenticated, thread?._id, isThreadBookmarked, getBookmarkId]);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(thread?._id); // Use thread ID directly
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const result = await addBookmark(thread?._id);
        if (result.success) {
          setIsBookmarked(true);
          setBookmarkId(thread?._id); // Use thread ID as bookmark ID
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
    setIsLoading(false);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPublishing(true);
    
    const result = await publishThread(thread._id);
    if (result.success) {
      // Thread will be updated in the store automatically
    } else {
      console.error('Failed to publish thread:', result.error);
    }
    
    setIsPublishing(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this thread? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    const result = await deleteThread(thread._id);
    if (result.success) {
      // Thread will be removed from the store automatically
    } else {
      console.error('Failed to delete thread:', result.error);
    }
    
    setIsDeleting(false);
  };

  // Check if current user is the author
  const isAuthor = user && user._id === thread?.author?._id;

  console.log('Rendering ThreadCard for thread:', thread, 'at index:', index);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-neutral-200 dark:border-neutral-700 overflow-hidden"
    >
      <Link to={`/thread/${thread._id}`} className="block p-4">
        <div className="flex items-center gap-2 mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          <img
            src={thread.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.author?.username)}&background=random`}
            alt={thread.author?.username}
            className="w-5 h-5 rounded-full"
          />
          <span>{thread.author?.username}</span>
          {thread.originalThread && thread.originalThread.author?.username && (
            <>
              <span>·</span>
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                Inspired by {thread.originalThread.author.username}
              </span>
            </>
          )}
          <span>·</span>
          <span>{formatRelativeDate(thread.createdAt)}</span>
        </div>
        
        {/* Draft indicator */}
        {thread.isDraft && (
          <div className="inline-flex items-center gap-1 px-2 py-1 mb-2 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full dark:text-orange-300 dark:bg-orange-900/20 dark:border-orange-800">
            <Edit className="w-3 h-3" />
            Draft
          </div>
        )}
        
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3 line-clamp-2">
          {thread.title}
        </h3>
        
        {/* Segment previews with a quote-style format */}
        <div className="space-y-2 mb-4">
          {thread.previewSegments?.map((segment, idx) => (
            <div 
              key={idx} 
              className="relative"
            >
              {/* Left border accent with different colors */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                  idx === 0 ? 'bg-primary-400 dark:bg-primary-500' : 'bg-secondary-400 dark:bg-secondary-500'
                }`}
              ></div>
              
              {/* Content with subtle styling */}
              <div className="pl-3 ml-2">
                <p className={`text-sm ${
                  idx === 0 
                    ? 'text-neutral-800 dark:text-neutral-200 font-medium' 
                    : 'text-neutral-600 dark:text-neutral-400'
                } line-clamp-2`}>
                  {truncateText(segment.content, 120)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          {/* Stats section */}
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{thread.segments?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{getTotalReactions()}</span>
            </div>
            {thread.forkCount > 0 && (
              <div className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                <span>{thread.forkCount}</span>
              </div>
            )}
          </div>
          
          {/* Tags and bookmark section */}
          <div className="flex items-center gap-2 flex-1 min-w-0 ml-4">
            {/* Improved tags styling */}
            <div className="flex items-center gap-1 overflow-hidden">
              {thread.tags?.slice(0, 2).map((tag, tagIndex) => {
                const colors = [
                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
                  'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
                  'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
                  'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
                ];
                const colorClass = colors[tagIndex % colors.length];
                
                return (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClass} truncate max-w-24`}
                    title={tag}
                  >
                    {tag}
                  </span>
                );
              })}
              {thread.tags?.length > 2 && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  +{thread.tags.length - 2}
                </span>
              )}
            </div>
            
            {/* Bookmark button with count */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Action buttons for author's own threads */}
              {(showActions && isAuthor) && (
                <div className="flex items-center gap-1 mr-2">
                  {thread.isDraft && (
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="group relative p-2 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Publish thread"
                    >
                      <Upload className={`w-4 h-4 ${isPublishing ? 'text-green-400' : 'text-green-600 dark:text-green-400'} transition-colors`} />
                      {isPublishing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                  )}
                  
                  <Link
                    to={`/edit/${thread._id}`}
                    className="group p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-sm"
                    title="Edit thread"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                  </Link>
                  
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="group relative p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete thread"
                  >
                    <Trash2 className={`w-4 h-4 ${isDeleting ? 'text-red-400' : 'text-red-600 dark:text-red-400'} transition-colors`} />
                    {isDeleting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {thread.bookmarks?.length || 0}
                </span>
                <button
                  onClick={handleBookmarkToggle}
                  disabled={isLoading}
                  className={`p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 ${
                    isLoading ? 'opacity-50' : ''
                  }`}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ThreadCard;