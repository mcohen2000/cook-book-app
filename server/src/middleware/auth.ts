import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import Recipe from '../../models/Recipe';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookie
    if (!process.env.COOKIE_NAME) return;

    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: String(error) });
  }
};

export const isAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
      res
        .status(403)
        .json({ message: 'Forbidden: You are not the author of this recipe' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
