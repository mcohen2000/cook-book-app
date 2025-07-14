import express, { Request, Response, NextFunction, Router } from 'express';
import Recipe from '../models/Recipe';
import { auth, isAuthor } from '../middleware/auth';
import axios from 'axios';
import { ocrLlmPrompt } from '../utils/prompt';

const router: Router = express.Router();

// Get all recipes with optional search
const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, userId } = req.query;

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
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Missing text in request body' });
    return;
  }

  const llmUrl = process.env.LLM_URL;
  if (!llmUrl) {
    res.status(500).json({ error: 'LLM_URL environment variable not set' });
    return;
  }

  const prompt = ocrLlmPrompt(text);

  try {
    const response = await axios.post(`${llmUrl}`, {
      model: 'llama3.2',
      prompt,
      stream: false,
    });
    let result = response.data.response || response.data;

    let parsed;
    try {
      parsed = JSON.parse(result);
      res.json({ result: parsed });
      return;
    } catch (err) {
      const fixPrompt = `The following is invalid JSON. Please fix and return only valid JSON:\n\n${result}`;
      const fixResponse = await axios.post(`${llmUrl}`, {
        model: 'llama3.2',
        prompt: fixPrompt,
        stream: false,
      });
      let fixedResult = fixResponse.data.response || fixResponse.data;
      try {
        parsed = JSON.parse(fixedResult);
        res.json({ result: parsed });
        return;
      } catch (err2) {
        res.status(500).json({
          error:
            'Failed to parse LLM response as valid JSON, even after attempting to fix.',
        });
        return;
      }
    }
  } catch (error) {
    console.error('Ollama error:', error);
    res.status(500).json({ error: 'Failed to process with Ollama' });
    return;
  }
});

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', auth, createRecipe);
router.patch('/:id', auth, isAuthor, updateRecipe);
router.delete('/:id', auth, isAuthor, deleteRecipe);

export default router;
