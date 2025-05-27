import { format, formatDistanceToNow } from 'date-fns';

// Format date with readable format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

// Count total reactions across segments
export const countTotalReactions = (segments) => {
  if (!segments || !segments.length) return 0;
  return segments.reduce((total, segment) => {
    return total + (segment.reactions ? segment.reactions.length : 0);
  }, 0);
};

// Group reactions by type
export const groupReactionsByType = (reactions) => {
  if (!reactions || !reactions.length) return {};
  
  return reactions.reduce((grouped, reaction) => {
    const type = reaction.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(reaction);
    return grouped;
  }, {});
};

// Check if user has already reacted with a specific type
export const hasUserReacted = (reactions, userId, type) => {
  if (!reactions || !reactions.length || !userId) return false;
  return reactions.some(r => r.userId === userId && r.type === type);
};

// Get user reaction id for a specific type
export const getUserReactionId = (reactions, userId, type) => {
  if (!reactions || !reactions.length || !userId) return null;
  const reaction = reactions.find(r => r.userId === userId && r.type === type);
  return reaction ? reaction._id : null;
};

export const formatThreadStats = (thread) => {
  const reactionCount = thread.segments?.reduce((total, segment) => {
    return total + (segment.reactions?.length || 0);
  }, 0) || 0;

  const commentCount = thread.segments?.reduce((total, segment) => {
    return total + (segment.comments?.length || 0);
  }, 0) || 0;

  return {
    reactions: reactionCount,
    comments: commentCount,
    bookmarks: thread.bookmarks?.length || 0
  };
};

export const truncateText = (text, length = 150) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  const now = new Date();
  const threadDate = new Date(date);
  const diffInDays = Math.floor((now - threadDate) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};