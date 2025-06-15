import express from 'express';
import Recipe from '../models/Recipe';

const router = express.Router();

// Create a new recipe
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error });
  }
});

export default router;
