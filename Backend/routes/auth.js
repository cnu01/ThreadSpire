import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ 
      id: user._id, 
      username: user.username, 
      email: user.email 
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ token, user: { _id: user._id, id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user._id, 
      username: user.username, 
      email: user.email 
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user: { _id: user._id, id: user._id, username: user.username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;