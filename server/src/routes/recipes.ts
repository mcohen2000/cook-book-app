import express, { Request, Response, NextFunction, Router } from 'express';
import Recipe from '../models/Recipe';
import { auth, isAuthor } from '../middleware/auth';
import axios from 'axios';

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

  const prompt = `You are a helpful assistant. The following is a raw OCR scan of a recipe. Please extract and organize the information into a structured JSON format with the following fields:

{
  "title": "Recipe title",
  "description": "Recipe description",
  "ingredients": [
    {"name": "ingredient name", "amount": "amount/quantity"}
  ],
  "instructions": [
  
  ],
  "cookingTime": 30,
  "servings": 4
}

Make sure to list all the ingredients and their amounts.

Make sure to get the instructions and make each step a string in the array.

If you can't find a description, try to come up with a short creative description in complete sentence or two.

If any information is missing, use empty strings for text fields, empty arrays for lists, and 0 for numbers. Return ONLY the JSON object, no additional text.

Raw OCR Text:
${text}`;

  try {
    const response = await axios.post(`${llmUrl}`, {
      model: 'llama3.2',
      prompt,
      stream: false,
    });
    const result = response.data.response || response.data;
    res.json({ result });
    return;
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
