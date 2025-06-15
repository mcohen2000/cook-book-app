import express from 'express';
import Recipe from '../models/Recipe';

const router = express.Router();

// Get all recipes with optional search
router.get('/', async (req, res) => {
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
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

// Create a new recipe
router.post('/', async (req, res) => {
  try {
    console.log('create recipe', req.body);
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error });
  }
});

export default router;
