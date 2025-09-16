import RecipeCard from '../../components/RecipeCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';

describe('RecipeCard', () => {
  const mockRecipe = {
    _id: 'recipe-123',
    title: 'Delicious Pasta',
    description: 'A mouth-watering pasta dish with fresh ingredients',
    cookingTime: 30,
    servings: 4,
  };
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Content Display', () => {
    it('should render all recipe content correctly', async () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />);

      // Check title
      expect(screen.getByText('Delicious Pasta')).toBeInTheDocument();

      // Check description
      expect(
        screen.getByText('A mouth-watering pasta dish with fresh ingredients')
      ).toBeInTheDocument();

      // // Check cooking time
      expect(screen.getByText('30 min')).toBeInTheDocument();

      // // Check servings (plural)
      expect(screen.getByText('4 servings')).toBeInTheDocument();
    });

    it('should display singular serving correctly', () => {
      const singleServingRecipe = { ...mockRecipe, servings: 1 };
      renderWithRouter(<RecipeCard recipe={singleServingRecipe} />);

      expect(screen.getByText('1 serving')).toBeInTheDocument();
    });

    it('should display plural servings correctly', () => {
      const multipleServingRecipe = { ...mockRecipe, servings: 5 };
      renderWithRouter(<RecipeCard recipe={multipleServingRecipe} />);

      expect(screen.getByText('5 servings')).toBeInTheDocument();
    });
  });

  describe('Link Navigation', () => {
    it('should render as a clickable link', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should have correct href attribute for recipe link', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/recipes/recipe-123');
    });
  });
});
