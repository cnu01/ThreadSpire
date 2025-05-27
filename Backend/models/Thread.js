import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MIND_BLOWN', 'LIGHT_BULB', 'RELAXED', 'FIRE', 'LOVE', '🤯', '💡', '😌', '🔥', '🫶'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { _id: true });

const segmentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  reactions: {
    type: [reactionSchema],
    default: []
  }
}, {
  timestamps: true
});

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  segments: [segmentSchema],
  tags: [{
    type: String,
    trim: true
  }],
  isDraft: {
    type: Boolean,
    default: true
  },
  originalThread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  forkCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
threadSchema.index({ author: 1, isDraft: 1 });
threadSchema.index({ tags: 1 });

export default mongoose.model('Thread', threadSchema);