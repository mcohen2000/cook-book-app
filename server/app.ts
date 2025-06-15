import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);

export default app;
