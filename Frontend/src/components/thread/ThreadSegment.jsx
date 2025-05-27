import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useThreadStore } from '../../stores/threadStore';
import { REACTION_TYPES } from '../../utils/constants';

function ThreadSegment({ segment, threadId, segmentIndex, isAuthenticated }) {
  const { user } = useAuthStore();
  const { addReaction, removeReaction } = useThreadStore();
  const [isReacting, setIsReacting] = useState(false);
  
  // Handle reaction click
  const handleReaction = async (type) => {
    if (!isAuthenticated || isReacting) return;
    
    setIsReacting(true);
    
    try {
      // Check if user already reacted with this type
      const userReaction = segment.reactions?.find(r => {
        // Handle both string and ObjectId comparisons  
        const reactionUserId = r.user?._id || r.user?.toString?.() || r.user;
        const currentUserId = user._id || user.toString?.() || user;
        return reactionUserId === currentUserId && r.type === type;
      });
      
      if (userReaction) {
        // Remove existing reaction
        await removeReaction(threadId, segment._id, userReaction._id);
      } else {
        // Add new reaction
        await addReaction(threadId, segment._id, type);
      }
    } catch (error) {
      console.error('Failed to handle reaction:', error);
    } finally {
      setIsReacting(false);
    }
  };
  
  // Count reactions by type
  const getReactionCount = (type) => {
    if (!segment.reactions) return 0;
    return segment.reactions.filter(r => r.type === type).length;
  };
  
  // Check if user has reacted with specific type
  const hasUserReacted = (type) => {
    if (!isAuthenticated || !segment.reactions || !user) return false;
    return segment.reactions.some(r => {
      // Handle both string and ObjectId comparisons
      const reactionUserId = r.user?._id || r.user?.toString?.() || r.user;
      const currentUserId = user._id || user.toString?.() || user;
      return reactionUserId === currentUserId && r.type === type;
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: segmentIndex * 0.1 }}
      className="segment-wrapper mb-6"
      id={`segment-${segment._id}`}
    >
      {/* Segment content with improved typography */}
      <div 
        className="segment-content prose prose-sm md:prose-base dark:prose-invert max-w-none mb-4 
                   prose-headings:font-serif prose-headings:text-neutral-900 dark:prose-headings:text-white
                   prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed
                   prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-neutral-900 dark:prose-strong:text-white
                   prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                   prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-md"
        dangerouslySetInnerHTML={{ __html: segment.content }}
      />
      
      {/* Reactions section - compact and improved */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-700">
        {Object.values(REACTION_TYPES).map((type) => {
          const count = getReactionCount(type);
          const hasReacted = hasUserReacted(type);
          
          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={!isAuthenticated || isReacting}
              className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                transition-all duration-200 hover:scale-105 border
                ${hasReacted
                  ? 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-600'
                }
                ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
              `}
              aria-label={`React with ${type}`}
              title={`React with ${type}`}
            >
              <span className="mr-1">{type}</span>
              {count > 0 && (
                <span className="bg-white dark:bg-neutral-800 px-1 py-0.5 rounded-full text-xs font-semibold min-w-[16px] text-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}

export default ThreadSegment;