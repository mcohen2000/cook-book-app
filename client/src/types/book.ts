export interface Book {
  _id: string;
  title: string;
  recipes: Recipe[];
  author: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookModalItem {
  _id: string;
  title: string;
  recipes: string[];
  author: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
}

export interface User {
  _id: string;
  name: string;
}
