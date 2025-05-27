import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 500
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  threads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread'
  }]
}, {
  timestamps: true
});

// Index for efficient queries
collectionSchema.index({ user: 1 });

export default mongoose.model('Collection', collectionSchema);