import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import recipeRoutes from './src/routes/recipes';
import userRoutes from './src/routes/users';
import cookbooksRouter from './src/routes/books';
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: 'Set-Cookie',
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', cookbooksRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  }
);

export default app;
