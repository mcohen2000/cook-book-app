import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth } from '../middleware/auth';

dotenv.config();

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    if (
      !process.env.COOKIE_NAME ||
      !process.env.COOKIE_URL ||
      !process.env.JWT_SECRET
    )
      return;

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.cookie(process.env.COOKIE_NAME, token, {
      domain: process.env.COOKIE_URL,
      httpOnly: true,
      sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
      secure: process.env.SECURE_COOKIES === 'true' ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    if (
      !process.env.COOKIE_NAME ||
      !process.env.COOKIE_URL ||
      !process.env.JWT_SECRET
    )
      return;

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid login credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid login credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.cookie(process.env.COOKIE_NAME, token, {
      domain: process.env.COOKIE_URL,
      httpOnly: true,
      sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
      secure: process.env.SECURE_COOKIES === 'true' ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

// Get current user
router.get('/auth', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    likedRecipes: req.user.likedRecipes,
    likedCookbooks: req.user.likedCookbooks,
  });
});

// Update user profile
router.patch('/profile', auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Name is required and cannot be empty' });
      return;
    }

    // Update user's name
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      likedRecipes: updatedUser.likedRecipes,
      likedCookbooks: updatedUser.likedCookbooks,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' });
  }
});

// Logout user
router.post('/logout', (req: Request, res: Response) => {
  if (!process.env.COOKIE_NAME || !process.env.COOKIE_URL) return;
  res.clearCookie(process.env.COOKIE_NAME, {
    domain: process.env.COOKIE_URL,
    httpOnly: true,
    sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
    secure: process.env.SECURE_COOKIES === 'true' ? true : false,
  });
  res.json({ message: 'Logged out successfully' });
});

// Like a recipe
router.post('/like/recipe/:id', auth, async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { likedRecipes: recipeId } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ likedRecipes: updatedUser.likedRecipes });
  } catch (error) {
    res.status(400).json({ error: 'Error liking recipe' });
  }
});

// Unlike a recipe
router.post('/unlike/recipe/:id', auth, async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { likedRecipes: recipeId } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ likedRecipes: updatedUser.likedRecipes });
  } catch (error) {
    res.status(400).json({ error: 'Error unliking recipe' });
  }
});

// Like a cookbook
router.post('/like/cookbook/:id', auth, async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { likedCookbooks: bookId } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ likedCookbooks: updatedUser.likedCookbooks });
  } catch (error) {
    res.status(400).json({ error: 'Error liking cookbook' });
  }
});

// Unlike a cookbook
router.post(
  '/unlike/cookbook/:id',
  auth,
  async (req: Request, res: Response) => {
    try {
      const bookId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { likedCookbooks: bookId } },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ likedCookbooks: updatedUser.likedCookbooks });
    } catch (error) {
      res.status(400).json({ error: 'Error unliking cookbook' });
    }
  }
);

export default router;
