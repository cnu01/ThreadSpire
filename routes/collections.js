import express from 'express';
import Collection from '../models/Collection.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's collections
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.userId })
      .populate('threads')
      .lean();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch collections' });
  }
});

// Get collection by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('threads');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch collection' });
  }
});

// Create collection
router.post('/', auth, async (req, res) => {
  try {
    const collection = new Collection({
      ...req.body,
      user: req.userId
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create collection' });
  }
});

// Update collection
router.put('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update collection' });
  }
});

// Delete collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete collection' });
  }
});

// Add thread to collection
router.post('/:id/threads', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (!collection.threads.includes(req.body.threadId)) {
      collection.threads.push(req.body.threadId);
      await collection.save();
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add thread to collection' });
  }
});

// Remove thread from collection
router.delete('/:id/threads/:threadId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    collection.threads = collection.threads.filter(
      t => t.toString() !== req.params.threadId
    );
    await collection.save();

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove thread from collection' });
  }
});

export default router;