import express from 'express';
import Thread from '../models/Thread.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/featured', async (req, res) => {
  try {
    // Support tag and sort query params for featured threads
    const { tag, sort = 'popular' } = req.query;
    let query = { isDraft: false };
    if (tag) query.tags = tag;
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { 'bookmarks.length': -1 };
        break;
      case 'forked':
        sortOption = { forkCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { 'bookmarks.length': -1 };
    }
    console.log('Fetching featured threads with query:', query,);
    const threads = await Thread.find(query)
      .sort(sortOption)
      .populate('author', 'username')
      .populate({
        path: 'originalThread',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .lean();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured threads' });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    console.log('Fetching threads for user:', req.userId);
    const threads = await Thread.find({ author: req.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate({
        path: 'originalThread',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .lean();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user threads' });
  }
});

// Get all published threads
router.get('/', async (req, res) => {
  try {
    const { tag, sort = 'popular' } = req.query;
    
    let query = { isDraft: false };
    if (tag) query.tags = tag;

    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { 'bookmarks.length': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const threads = await Thread.find(query)
      .sort(sortOption)
      .populate('author', 'username')
      .populate({
        path: 'originalThread',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .lean();

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch threads' });
  }
});

// Get thread by ID
router.get('/:id', async (req, res) => {
  try {
    let thread = await Thread.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'originalThread',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .lean();

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Add userId field to each reaction for frontend compatibility
    thread.segments.forEach(seg => {
      if (Array.isArray(seg.reactions)) {
        seg.reactions.forEach(r => {
          r.userId = r.user?.toString?.() || r.user;
        });
      }
    });

    // Find related threads by tag (excluding itself)
    const relatedThreads = await Thread.find({
      _id: { $ne: thread._id },
      tags: { $in: thread.tags },
      isDraft: false
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'username')
      .lean();

    thread.relatedThreads = relatedThreads;
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch thread' });
  }
});

// Create thread
router.post('/', auth, async (req, res) => {
  try {
    const thread = new Thread({
      ...req.body,
      author: req.userId
    });

    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create thread' });
  }
});

// Update thread
router.put('/:id', auth, async (req, res) => {
  try {
    const thread = await Thread.findOne({
      _id: req.params.id,
      author: req.userId
    });

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    Object.assign(thread, req.body);
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update thread' });
  }
});

// Add reaction
router.post('/:threadId/segments/:segmentId/reactions', auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const segment = thread.segments.id(req.params.segmentId);
    if (!segment) {
      console.log('Segment not found');
      return res.status(404).json({ message: 'Segment not found' });
    }

    // Accept both 'type' and 'reactionType' for compatibility
    const reactionType = req.body.type || req.body.reactionType;
    console.log('Reaction type received:', reactionType);
    console.log('Full request body:', req.body);
    
    if (!reactionType) {
      console.log('No reaction type provided');
      return res.status(400).json({ message: 'Reaction type is required' });
    }
    
    // Map the reaction type if it's a constant rather than emoji
    const reactionMapping = {
      'MIND_BLOWN': '🤯',
      'LIGHT_BULB': '💡',
      'RELAXED': '😌',
      'FIRE': '🔥',
      'LOVE': '🫶'
    };
    
    const actualReactionType = reactionMapping[reactionType] || reactionType;
    console.log('Mapped reaction type:', actualReactionType);

    // Make sure segment.reactions is an array
    if (!Array.isArray(segment.reactions)) {
      console.log('Initializing reactions array');
      segment.reactions = [];
    }

    // Check if user already reacted to this segment (any reaction type)
    const existingUserReaction = segment.reactions.find(r => 
      r.user && r.user.toString() === req.userId
    );
    
    console.log('Existing user reaction:', existingUserReaction);
    
    // If user already reacted to this segment
    if (existingUserReaction) {
      // If it's the same reaction type, remove it (toggle off)
      if (existingUserReaction.type === actualReactionType) {
        console.log('Removing existing reaction (toggle off)');
        segment.reactions = segment.reactions.filter(r => 
          !(r.user && r.user.toString() === req.userId)
        );
      } else {
        // If it's a different reaction type, replace it
        console.log('Replacing existing reaction with new type');
        existingUserReaction.type = actualReactionType;
      }
    } else {
      // Add the new reaction
      console.log('Adding new reaction');
      if (actualReactionType && req.userId) {
        segment.reactions.push({
          type: actualReactionType,
          user: req.userId
        });
      } else {
        console.error('Invalid reaction data:', { actualReactionType, userId: req.userId });
        return res.status(400).json({ message: 'Invalid reaction data' });
      }
    }

    console.log('Saving thread with reaction changes');
    try {
      await thread.save();
      console.log('Thread saved successfully');
      
      // Populate author and reactions' userId for frontend compatibility
      const updatedThread = await Thread.findById(thread._id)
        .populate('author', 'username')
        .lean();
        
      console.log('Thread fetched with populated fields');
      
      // Add userId field to each reaction for frontend compatibility
      updatedThread.segments.forEach(seg => {
        if (Array.isArray(seg.reactions)) {
          seg.reactions.forEach(r => {
            r.userId = r.user?.toString?.() || r.user;
          });
        }
      });
      
      console.log('Reaction userId fields added');
      return res.json(updatedThread);
    } catch (saveError) {
      console.error('Error saving thread:', saveError);
      return res.status(500).json({ 
        message: 'Failed to save reaction',
        error: saveError.message
      });
    }
  } catch (error) {
    console.error('Failed to add reaction:', error);
    res.status(500).json({ 
      message: 'Failed to add reaction',
      error: error.message
    });
  }
});

// Remove reaction
router.delete('/:threadId/segments/:segmentId/reactions/:reactionId', auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const segment = thread.segments.id(req.params.segmentId);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    const reaction = segment.reactions.id(req.params.reactionId);
    if (!reaction || reaction.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Reaction not found' });
    }

    reaction.remove();
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove reaction' });
  }
});

// Fork thread
router.post('/:id/fork', auth, async (req, res) => {
  try {
    const originalThread = await Thread.findById(req.params.id);
    if (!originalThread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const forkedThread = new Thread({
      title: originalThread.title,
      segments: originalThread.segments.map(s => ({ content: s.content })),
      tags: originalThread.tags,
      author: req.userId,
      originalThread: originalThread._id,
      isDraft: true
    });

    await forkedThread.save();
    // Increment fork count on the original thread
    originalThread.forkCount = (originalThread.forkCount || 0) + 1;
    await originalThread.save();
    res.status(201).json(forkedThread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fork thread' });
  }
});

// Publish a draft thread
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Check if the user is the author
    if (thread.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to publish this thread' });
    }
    
    // Check if it's already published
    if (!thread.isDraft) {
      return res.status(400).json({ message: 'Thread is already published' });
    }
    
    thread.isDraft = false;
    await thread.save();
    
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish thread' });
  }
});

// Delete thread (only by author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Check if the user is the author
    if (thread.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }
    
    await Thread.findByIdAndDelete(req.params.id);
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete thread' });
  }
});


export default router;