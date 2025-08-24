export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  cookingTime: number;
  servings: number;
  nutrition?: any;
  createdAt?: string;
  author?: string;
}
