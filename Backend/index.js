import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import threadRoutes from './routes/threads.js';
import collectionRoutes from './routes/collections.js';
import bookmarkRoutes from './routes/bookmarks.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ message: 'ThreadSpire Backend API is running!', status: 'healthy' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/analytics', analyticsRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database URL:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if can't connect to database
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});