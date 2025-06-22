import express, { Request, Response, NextFunction, Router } from 'express';
import Book from '../models/Book';
import { auth, isAuthor as isBookAuthor } from '../middleware/auth';

const router: Router = express.Router();

// Get all cookbooks
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find()
      .populate('recipes', 'title description cookingTime servings')
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Get current user's cookbooks
router.get(
  '/my-cookbooks',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await Book.find({ author: req.user._id }).sort({
        createdAt: -1,
      });
      res.json(books);
    } catch (error) {
      next(error);
    }
  }
);

// Get a single cookbook by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('recipes', 'title description cookingTime servings')
      .populate('author', 'name');
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
  '/:cookbookId/add-recipe',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipeId } = req.body;
      const { cookbookId } = req.params;

      if (!recipeId) {
        res.status(400).json({ message: 'recipeId is required' });
        return;
      }

      // Find the book and verify ownership
      const book = await Book.findOne({
        _id: cookbookId,
        author: req.user._id,
      });

      if (!book) {
        res.status(404).json({
          message: 'Cookbook not found or you do not have permission',
        });
        return;
      }

      // Add the recipe if it doesn't already exist in the cookbook
      if (!book.recipes.includes(recipeId)) {
        book.recipes.push(recipeId);
        await book.save();
      }

      res.json(book);
    } catch (error) {
      next(error);
    }
  }
);

// Remove a recipe from a cookbook
router.patch(
  '/:cookbookId/remove-recipe',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipeId } = req.body;
      const { cookbookId } = req.params;

      if (!recipeId) {
        res.status(400).json({ message: 'recipeId is required' });
        return;
      }

      // Find the book and verify ownership
      const book = await Book.findOne({
        _id: cookbookId,
        author: req.user._id,
      });

      if (!book) {
        res.status(404).json({
          message: 'Cookbook not found or you do not have permission',
        });
        return;
      }

      // Remove the recipe if it exists in the cookbook
      const recipeIndex = book.recipes.indexOf(recipeId);
      if (recipeIndex > -1) {
        book.recipes.splice(recipeIndex, 1);
        await book.save();
      }

      res.json(book);
    } catch (error) {
      next(error);
    }
  }
);

// Add a recipe to multiple cookbooks
router.post(
  '/add-recipe',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipeId, cookbookIds } = req.body;
      if (
        !recipeId ||
        !Array.isArray(cookbookIds) ||
        cookbookIds.length === 0
      ) {
        res
          .status(400)
          .json({ message: 'recipeId and cookbookIds[] are required' });
        return;
      }

      // Find all books that match the IDs and are owned by the user.
      // This automatically filters out any books they don't own, without causing an error.
      const booksToUpdate = await Book.find({
        _id: { $in: cookbookIds },
        author: req.user._id,
      });

      const updatedBooks = [];
      for (const book of booksToUpdate) {
        if (!book.recipes.includes(recipeId)) {
          book.recipes.push(recipeId);
          await book.save();
        }
        updatedBooks.push(book);
      }
      res.json(updatedBooks);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
