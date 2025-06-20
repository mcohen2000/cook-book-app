import express, { Request, Response, NextFunction, Router } from 'express';
import Book from '../models/Book';
import { auth, isAuthor as isBookAuthor } from '../middleware/auth';

const router: Router = express.Router();

// Get all cookbooks
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Get a single cookbook by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
});

// Create a new cookbook
router.post(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = new Book({ ...req.body, author: req.user._id });
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }
);

// Update a cookbook
router.patch(
  '/:id',
  auth,
  isBookAuthor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
      }
      res.json(book);
    } catch (error) {
      next(error);
    }
  }
);

// Delete a cookbook
router.delete(
  '/:id',
  auth,
  isBookAuthor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Add a recipe to a cookbook
router.patch(
  '/:id/add-recipe',
  auth,
  isBookAuthor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipeId } = req.body;
      if (!recipeId) {
        res.status(400).json({ message: 'Recipe ID is required' });
        return;
      }
      const book = await Book.findById(req.params.id);
      if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
      }
      if (!book.recipes.includes(recipeId)) {
        book.recipes.push(recipeId);
        await book.save();
      }
      res.json(book);
      return;
    } catch (error) {
      next(error);
    }
  }
);

export default router;
