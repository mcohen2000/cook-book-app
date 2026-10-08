import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Book from '../models/Book';
import Recipe from '../models/Recipe';
import { User } from '../models/User';

dotenv.config();

const SEED_EMAIL = 'seed@cookbook.local';
const SEED_PASSWORD = 'password123';
const SEED_NAME = 'Seed Cook';

const recipes = [
  {
    title: 'Weeknight Tomato Pasta',
    description:
      'A simple garlic and tomato pasta that comes together in about twenty minutes.',
    ingredients: [
      { name: 'spaghetti', amount: '12 oz' },
      { name: 'olive oil', amount: '3 tbsp' },
      { name: 'garlic', amount: '4 cloves' },
      { name: 'crushed tomatoes', amount: '28 oz' },
      { name: 'salt', amount: '1 tsp' },
      { name: 'fresh basil', amount: '1/4 cup' },
    ],
    instructions: [
      'Boil the spaghetti in salted water until al dente.',
      'Warm the olive oil in a pan and cook the garlic until fragrant.',
      'Add the crushed tomatoes and salt, then simmer for 10 minutes.',
      'Toss the pasta with the sauce and finish with basil.',
    ],
    cookingTime: 25,
    servings: 4,
  },
  {
    title: 'Lemon Herb Roast Chicken',
    description: 'A whole roast chicken with lemon, garlic, and herbs.',
    ingredients: [
      { name: 'whole chicken', amount: '4 lb' },
      { name: 'lemon', amount: '1' },
      { name: 'garlic', amount: '1 head' },
      { name: 'olive oil', amount: '2 tbsp' },
      { name: 'fresh thyme', amount: '4 sprigs' },
      { name: 'salt', amount: '2 tsp' },
      { name: 'black pepper', amount: '1 tsp' },
    ],
    instructions: [
      'Heat the oven to 425°F.',
      'Pat the chicken dry and rub it with olive oil, salt, and pepper.',
      'Stuff the cavity with lemon, garlic, and thyme.',
      'Roast until the juices run clear, about 1 hour 15 minutes.',
      'Rest for 10 minutes before carving.',
    ],
    cookingTime: 90,
    servings: 6,
  },
  {
    title: 'Banana Oat Pancakes',
    description: 'Fluffy pancakes made with ripe banana and rolled oats.',
    ingredients: [
      { name: 'ripe banana', amount: '1' },
      { name: 'eggs', amount: '2' },
      { name: 'rolled oats', amount: '1 cup' },
      { name: 'milk', amount: '1/2 cup' },
      { name: 'baking powder', amount: '1 tsp' },
      { name: 'butter', amount: '1 tbsp' },
    ],
    instructions: [
      'Mash the banana, then stir in the eggs, oats, milk, and baking powder.',
      'Let the batter sit for 5 minutes so the oats soften.',
      'Melt the butter in a skillet over medium heat.',
      'Cook the pancakes until bubbles form, then flip and cook until golden.',
    ],
    cookingTime: 20,
    servings: 2,
  },
  {
    title: 'Sheet Pan Veggie Tacos',
    description:
      'Roasted peppers, onion, and black beans tucked into warm tortillas.',
    ingredients: [
      { name: 'bell peppers', amount: '3' },
      { name: 'red onion', amount: '1' },
      { name: 'black beans', amount: '1 can' },
      { name: 'olive oil', amount: '2 tbsp' },
      { name: 'chili powder', amount: '1 tsp' },
      { name: 'corn tortillas', amount: '8' },
      { name: 'lime', amount: '1' },
    ],
    instructions: [
      'Heat the oven to 425°F.',
      'Toss the peppers and onion with olive oil and chili powder.',
      'Roast for 20 minutes, then stir in the drained black beans and roast 5 more minutes.',
      'Warm the tortillas and fill them with the vegetables.',
      'Squeeze lime over the top before serving.',
    ],
    cookingTime: 35,
    servings: 4,
  },
  {
    title: 'Classic Chocolate Chip Cookies',
    description:
      'Chewy cookies with brown sugar and plenty of chocolate chips.',
    ingredients: [
      { name: 'butter', amount: '1 cup' },
      { name: 'brown sugar', amount: '3/4 cup' },
      { name: 'granulated sugar', amount: '1/2 cup' },
      { name: 'eggs', amount: '2' },
      { name: 'vanilla extract', amount: '2 tsp' },
      { name: 'all-purpose flour', amount: '2 1/4 cups' },
      { name: 'baking soda', amount: '1 tsp' },
      { name: 'salt', amount: '1 tsp' },
      { name: 'chocolate chips', amount: '2 cups' },
    ],
    instructions: [
      'Heat the oven to 375°F.',
      'Beat the butter and sugars until creamy, then mix in the eggs and vanilla.',
      'Stir in the flour, baking soda, and salt, then fold in the chocolate chips.',
      'Drop rounded tablespoons onto a baking sheet.',
      'Bake for 9 to 11 minutes, until the edges are golden.',
    ],
    cookingTime: 30,
    servings: 24,
  },
  {
    title: 'Garlic Butter Shrimp',
    description:
      'Quick skillet shrimp in garlic butter with a squeeze of lemon.',
    ingredients: [
      { name: 'shrimp', amount: '1 lb' },
      { name: 'butter', amount: '3 tbsp' },
      { name: 'garlic', amount: '4 cloves' },
      { name: 'lemon', amount: '1' },
      { name: 'parsley', amount: '2 tbsp' },
      { name: 'salt', amount: '1/2 tsp' },
    ],
    instructions: [
      'Pat the shrimp dry and season with salt.',
      'Melt the butter in a skillet and cook the garlic for 30 seconds.',
      'Add the shrimp and cook until pink, about 2 minutes per side.',
      'Finish with lemon juice and parsley.',
    ],
    cookingTime: 15,
    servings: 3,
  },
  {
    title: 'Veggie Fried Rice',
    description: 'Day-old rice stir-fried with eggs, peas, and scallions.',
    ingredients: [
      { name: 'cooked rice', amount: '3 cups' },
      { name: 'eggs', amount: '2' },
      { name: 'frozen peas', amount: '1 cup' },
      { name: 'scallions', amount: '3' },
      { name: 'soy sauce', amount: '2 tbsp' },
      { name: 'sesame oil', amount: '1 tsp' },
    ],
    instructions: [
      'Scramble the eggs in a hot skillet, then set them aside.',
      'Stir-fry the peas and scallions for 1 minute.',
      'Add the rice and soy sauce, pressing it into the pan so it crisps.',
      'Fold the eggs back in and finish with sesame oil.',
    ],
    cookingTime: 20,
    servings: 4,
  },
  {
    title: 'Creamy Mushroom Risotto',
    description: 'Slow-stirred rice with mushrooms, broth, and parmesan.',
    ingredients: [
      { name: 'arborio rice', amount: '1 1/2 cups' },
      { name: 'mushrooms', amount: '8 oz' },
      { name: 'vegetable broth', amount: '4 cups' },
      { name: 'onion', amount: '1' },
      { name: 'parmesan', amount: '1/2 cup' },
      { name: 'butter', amount: '2 tbsp' },
    ],
    instructions: [
      'Warm the broth in a saucepan and keep it simmering.',
      'Cook the onion and mushrooms in butter until soft.',
      'Stir in the rice, then add broth one ladle at a time.',
      'Keep stirring until the rice is creamy, about 20 minutes.',
      'Stir in the parmesan and serve right away.',
    ],
    cookingTime: 40,
    servings: 4,
  },
  {
    title: 'Honey Garlic Salmon',
    description: 'Baked salmon fillets with a sticky honey garlic glaze.',
    ingredients: [
      { name: 'salmon fillets', amount: '4' },
      { name: 'honey', amount: '2 tbsp' },
      { name: 'soy sauce', amount: '2 tbsp' },
      { name: 'garlic', amount: '3 cloves' },
      { name: 'olive oil', amount: '1 tbsp' },
      { name: 'black pepper', amount: '1/2 tsp' },
    ],
    instructions: [
      'Heat the oven to 400°F.',
      'Stir together the honey, soy sauce, garlic, and olive oil.',
      'Place the salmon on a lined sheet pan and brush on the glaze.',
      'Bake for 12 to 15 minutes, until the fish flakes easily.',
    ],
    cookingTime: 20,
    servings: 4,
  },
  {
    title: 'Caprese Salad',
    description: 'Sliced tomatoes, mozzarella, and basil with olive oil.',
    ingredients: [
      { name: 'ripe tomatoes', amount: '3' },
      { name: 'fresh mozzarella', amount: '8 oz' },
      { name: 'fresh basil', amount: '1/2 cup' },
      { name: 'olive oil', amount: '2 tbsp' },
      { name: 'balsamic vinegar', amount: '1 tbsp' },
      { name: 'salt', amount: '1/2 tsp' },
    ],
    instructions: [
      'Slice the tomatoes and mozzarella into even rounds.',
      'Arrange them on a plate, tucking basil between the slices.',
      'Drizzle with olive oil and balsamic vinegar.',
      'Season with salt and serve immediately.',
    ],
    cookingTime: 10,
    servings: 4,
  },
  {
    title: 'Beef Chili',
    description: 'A pot of beef chili with beans, tomatoes, and warm spices.',
    ingredients: [
      { name: 'ground beef', amount: '1 lb' },
      { name: 'onion', amount: '1' },
      { name: 'kidney beans', amount: '1 can' },
      { name: 'crushed tomatoes', amount: '28 oz' },
      { name: 'chili powder', amount: '2 tbsp' },
      { name: 'cumin', amount: '1 tsp' },
    ],
    instructions: [
      'Brown the beef and onion in a large pot.',
      'Stir in the chili powder and cumin and cook for 1 minute.',
      'Add the tomatoes and drained beans.',
      'Simmer for 30 minutes, stirring now and then.',
    ],
    cookingTime: 45,
    servings: 6,
  },
  {
    title: 'Apple Cinnamon Oatmeal',
    description:
      'Stovetop oats with diced apple, cinnamon, and a little maple.',
    ingredients: [
      { name: 'rolled oats', amount: '1 cup' },
      { name: 'milk', amount: '2 cups' },
      { name: 'apple', amount: '1' },
      { name: 'cinnamon', amount: '1 tsp' },
      { name: 'maple syrup', amount: '1 tbsp' },
      { name: 'salt', amount: '1 pinch' },
    ],
    instructions: [
      'Dice the apple, leaving the skin on.',
      'Simmer the oats, milk, apple, cinnamon, and salt for 8 minutes.',
      'Stir until the oats are creamy and the apple is soft.',
      'Drizzle with maple syrup before serving.',
    ],
    cookingTime: 15,
    servings: 2,
  },
  {
    title: 'Chicken Noodle Soup',
    description: 'A pot of chicken soup with carrots, celery, and egg noodles.',
    ingredients: [
      { name: 'chicken thighs', amount: '1 lb' },
      { name: 'chicken broth', amount: '6 cups' },
      { name: 'carrots', amount: '2' },
      { name: 'celery', amount: '2 stalks' },
      { name: 'egg noodles', amount: '2 cups' },
      { name: 'salt', amount: '1 tsp' },
    ],
    instructions: [
      'Simmer the chicken in the broth until cooked through, about 20 minutes.',
      'Remove the chicken, shred it, and return it to the pot.',
      'Add the sliced carrots and celery and cook for 8 minutes.',
      'Stir in the noodles and cook until tender.',
    ],
    cookingTime: 40,
    servings: 6,
  },
  {
    title: 'Margherita Flatbread',
    description: 'A quick flatbread topped with tomato, mozzarella, and basil.',
    ingredients: [
      { name: 'flatbreads', amount: '2' },
      { name: 'tomato sauce', amount: '1/2 cup' },
      { name: 'fresh mozzarella', amount: '6 oz' },
      { name: 'fresh basil', amount: '1/4 cup' },
      { name: 'olive oil', amount: '1 tbsp' },
      { name: 'salt', amount: '1/4 tsp' },
    ],
    instructions: [
      'Heat the oven to 450°F.',
      'Spread tomato sauce over each flatbread.',
      'Top with torn mozzarella and a pinch of salt.',
      'Bake for 8 minutes, then finish with basil and olive oil.',
    ],
    cookingTime: 15,
    servings: 2,
  },
  {
    title: 'Cucumber Yogurt Dip',
    description: 'A cool dip of yogurt, cucumber, garlic, and dill.',
    ingredients: [
      { name: 'plain yogurt', amount: '1 cup' },
      { name: 'cucumber', amount: '1' },
      { name: 'garlic', amount: '1 clove' },
      { name: 'fresh dill', amount: '1 tbsp' },
      { name: 'lemon juice', amount: '1 tbsp' },
      { name: 'salt', amount: '1/2 tsp' },
    ],
    instructions: [
      'Grate the cucumber and squeeze out the extra water.',
      'Stir it into the yogurt with garlic, dill, lemon juice, and salt.',
      'Chill for 15 minutes so the flavors come together.',
      'Serve with vegetables or warm bread.',
    ],
    cookingTime: 20,
    servings: 4,
  },
  {
    title: 'Maple Glazed Carrots',
    description: 'Roasted carrots finished with butter and maple syrup.',
    ingredients: [
      { name: 'carrots', amount: '1 lb' },
      { name: 'olive oil', amount: '1 tbsp' },
      { name: 'maple syrup', amount: '1 tbsp' },
      { name: 'butter', amount: '1 tbsp' },
      { name: 'salt', amount: '1/2 tsp' },
      { name: 'black pepper', amount: '1/4 tsp' },
    ],
    instructions: [
      'Heat the oven to 425°F.',
      'Toss the carrots with olive oil, salt, and pepper.',
      'Roast for 20 minutes, until tender at the edges.',
      'Toss with butter and maple syrup and roast 5 more minutes.',
    ],
    cookingTime: 30,
    servings: 4,
  },
  {
    title: 'Soy Ginger Noodles',
    description:
      'Soft noodles tossed in a quick soy, ginger, and garlic sauce.',
    ingredients: [
      { name: 'noodles', amount: '8 oz' },
      { name: 'soy sauce', amount: '3 tbsp' },
      { name: 'fresh ginger', amount: '1 tbsp' },
      { name: 'garlic', amount: '2 cloves' },
      { name: 'sesame oil', amount: '1 tsp' },
      { name: 'scallions', amount: '2' },
    ],
    instructions: [
      'Cook the noodles until tender, then drain them.',
      'Warm the soy sauce, ginger, and garlic in a skillet.',
      'Toss the noodles in the sauce until coated.',
      'Finish with sesame oil and sliced scallions.',
    ],
    cookingTime: 15,
    servings: 2,
  },
  {
    title: 'Blueberry Muffins',
    description:
      'Soft muffins studded with blueberries and a little lemon zest.',
    ingredients: [
      { name: 'all-purpose flour', amount: '2 cups' },
      { name: 'sugar', amount: '3/4 cup' },
      { name: 'baking powder', amount: '2 tsp' },
      { name: 'milk', amount: '1 cup' },
      { name: 'egg', amount: '1' },
      { name: 'blueberries', amount: '1 1/2 cups' },
      { name: 'lemon zest', amount: '1 tsp' },
    ],
    instructions: [
      'Heat the oven to 375°F and line a muffin tin.',
      'Stir the dry ingredients together, then mix in the milk, egg, and zest.',
      'Fold in the blueberries.',
      'Divide the batter into the tin and bake for 20 minutes.',
    ],
    cookingTime: 30,
    servings: 12,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      'Set MONGODB_URI or MONGO_URI in server/.env before running the seed script.',
    );
  }

  await mongoose.connect(uri);

  let user = await User.findOne({ email: SEED_EMAIL });
  if (!user) {
    user = await User.create({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      name: SEED_NAME,
    });
    console.log(`Created seed user ${SEED_EMAIL}`);
  } else {
    console.log(`Using existing seed user ${SEED_EMAIL}`);
  }

  await Recipe.deleteMany({ author: user._id });
  await Book.deleteMany({ author: user._id });

  const createdRecipes = await Recipe.insertMany(
    recipes.map((recipe) => ({ ...recipe, author: user._id })),
  );

  const byTitle = (title: string) => {
    const recipe = createdRecipes.find((item) => item.title === title);
    if (!recipe) {
      throw new Error(`Missing seeded recipe: ${title}`);
    }
    return recipe._id;
  };

  const cookbooks = [
    {
      title: 'Weeknight Dinners',
      description: 'Meals you can cook after work without a long grocery list.',
      recipes: [
        byTitle('Weeknight Tomato Pasta'),
        byTitle('Sheet Pan Veggie Tacos'),
        byTitle('Garlic Butter Shrimp'),
      ],
      author: user._id,
    },
    {
      title: 'Sunday Cooking',
      description: 'Slower recipes for a quiet morning or a roast dinner.',
      recipes: [
        byTitle('Lemon Herb Roast Chicken'),
        byTitle('Banana Oat Pancakes'),
        byTitle('Classic Chocolate Chip Cookies'),
        byTitle('Blueberry Muffins'),
      ],
      author: user._id,
    },
    {
      title: 'Quick Meals',
      description: 'Recipes that are ready in about twenty minutes.',
      recipes: [
        byTitle('Veggie Fried Rice'),
        byTitle('Honey Garlic Salmon'),
        byTitle('Caprese Salad'),
        byTitle('Soy Ginger Noodles'),
      ],
      author: user._id,
    },
  ];

  await Book.insertMany(cookbooks);

  console.log(
    `Seeded ${createdRecipes.length} recipes and ${cookbooks.length} cookbooks.`,
  );
  console.log(`Log in as ${SEED_EMAIL} / ${SEED_PASSWORD}`);
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
