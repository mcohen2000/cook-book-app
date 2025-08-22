import express, { Request, Response, NextFunction, Router } from 'express';
import Recipe from '../models/Recipe';
import { auth, isAuthor } from '../middleware/auth';
import { callOpenAI, callOllama } from '../services/llmService';

const router: Router = express.Router();

// Get all recipes with optional search
const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, userId, page = '1', count } = req.query;
    const pageSize = count ? parseInt(count as string, 10) || 12 : 12;
    const pageNumber = parseInt(page as string, 10) || 1;

    let query: any = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'ingredients.name': { $regex: search, $options: 'i' } },
        ],
      };
    }
    if (userId) {
      query = { ...query, author: userId };
    }

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      recipes,
      total,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
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
    const recipe = new Recipe({ ...req.body, author: req.user._id });
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

// POST /api/recipes/ocr
router.post('/ocr', async (req, res) => {
  const { text, provider } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Missing text in request body' });
    return;
  }

  try {
    let result;
    if (provider === 'openai') {
      result = await callOpenAI(text);
    } else if (provider === 'ollama') {
      result = await callOllama(text);
    } else {
      res.status(400).json({ error: 'Unsupported LLM provider' });
      return;
    }
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', auth, createRecipe);
router.patch('/:id', auth, isAuthor, updateRecipe);
router.delete('/:id', auth, isAuthor, deleteRecipe);

export default router;
