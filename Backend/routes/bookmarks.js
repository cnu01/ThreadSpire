import express from 'express';
import mongoose from 'mongoose';
import Thread from '../models/Thread.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const threads = await Thread.find({
      bookmarks: req.userId
    }).populate('author', 'username').lean();
    
    // Transform to bookmark format for frontend compatibility
    const bookmarks = threads.map(thread => ({
      _id: thread._id, // Use thread ID as bookmark ID since it's 1:1
      thread: thread,
      user: req.userId,
      createdAt: new Date() // We don't track bookmark creation time, so use current
    }));
    
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
});

// Add bookmark
router.post('/', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.body.threadId)) {
      return res.status(400).json({ message: 'Invalid thread ID format' });
    }
    
    const thread = await Thread.findById(req.body.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Clean up any invalid reactions before saving
    thread.segments.forEach(segment => {
      if (segment.reactions && Array.isArray(segment.reactions)) {
        segment.reactions = segment.reactions.filter(reaction => {
          return reaction.type && reaction.user && mongoose.Types.ObjectId.isValid(reaction.user);
        });
      }
    });

    // Check if already bookmarked to prevent duplicates
    if (!thread.bookmarks.includes(req.userId)) {
      thread.bookmarks.push(req.userId);
      await thread.save();
    }

    // Return bookmark format for frontend compatibility
    const bookmark = {
      _id: thread._id, // Use thread ID as bookmark ID since it's 1:1
      thread: thread,
      user: req.userId,
      createdAt: new Date()
    };

    res.json(bookmark);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Failed to add bookmark', error: error.message });
  }
});

// Remove bookmark
router.delete('/:threadId', auth, async (req, res) => {
  try {
    console.log('Removing bookmark for thread:', req.params.threadId);
    console.log('User ID:', req.userId);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.threadId)) {
      return res.status(400).json({ message: 'Invalid thread ID format' });
    }
    
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Clean up any invalid reactions before saving
    thread.segments.forEach(segment => {
      if (segment.reactions && Array.isArray(segment.reactions)) {
        segment.reactions = segment.reactions.filter(reaction => {
          return reaction.type && reaction.user && mongoose.Types.ObjectId.isValid(reaction.user);
        });
      }
    });

    thread.bookmarks = thread.bookmarks.filter(
      id => id.toString() !== req.userId
    );
  
    await thread.save();
    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Failed to remove bookmark', error: error.message });
  }
});

export default router;
