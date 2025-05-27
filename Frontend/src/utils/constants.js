// API base URL
export const API_URL = 'http://localhost:5001/api';

// Reaction types
export const REACTION_TYPES = {
  MIND_BLOWN: '🤯',
  LIGHT_BULB: '💡',
  RELAXED: '😌',
  FIRE: '🔥',
  LOVE: '🫶',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Bookmarked' },
  { value: 'forked', label: 'Most Forked' },
  { value: 'newest', label: 'Newest' },
];

// Common tags
export const COMMON_TAGS = [
  'Productivity',
  'Mindset',
  'Career',
  'Creativity',
  'Leadership',
  'Relationships',
  'Health',
  'Technology',
  'Finance',
  'Education',
];

// Max segment length
export const MAX_SEGMENT_LENGTH = 2000;

// Max thread title length
export const MAX_TITLE_LENGTH = 100;

// Max number of segments per thread
export const MAX_SEGMENTS = 20;