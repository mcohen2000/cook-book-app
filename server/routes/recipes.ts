import express, { Request, Response, NextFunction, Router } from 'express';
import Recipe from '../models/Recipe';

const router: Router = express.Router();

// Get all recipes with optional search
const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'ingredients.name': { $regex: search, $options: 'i' } },
        ],
      };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Get a single recipe by ID
const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// Create a new recipe
const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

// Update a recipe
const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// Delete a recipe
const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    next(error);
  }
};

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.patch('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
