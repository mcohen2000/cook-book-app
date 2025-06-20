import express, { Request, Response, NextFunction, Router } from 'express';
import Cookbook from '../models/book';
import { auth, isAuthor as isCookbookAuthor } from '../middleware/auth';

const router: Router = express.Router();

// Get all cookbooks
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookbooks = await Cookbook.find().sort({ createdAt: -1 });
    res.json(cookbooks);
  } catch (error) {
    next(error);
  }
});

// Get a single cookbook by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookbook = await Cookbook.findById(req.params.id);
    if (!cookbook) {
      res.status(404).json({ message: 'Cookbook not found' });
      return;
    }
    res.json(cookbook);
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
      const cookbook = new Cookbook({ ...req.body, author: req.user._id });
      await cookbook.save();
      res.status(201).json(cookbook);
    } catch (error) {
      next(error);
    }
  }
);

// Update a cookbook
router.patch(
  '/:id',
  auth,
  isCookbookAuthor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookbook = await Cookbook.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!cookbook) {
        res.status(404).json({ message: 'Cookbook not found' });
        return;
      }
      res.json(cookbook);
    } catch (error) {
      next(error);
    }
  }
);

// Delete a cookbook
router.delete(
  '/:id',
  auth,
  isCookbookAuthor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookbook = await Cookbook.findByIdAndDelete(req.params.id);
      if (!cookbook) {
        res.status(404).json({ message: 'Cookbook not found' });
        return;
      }
      res.json({ message: 'Cookbook deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
