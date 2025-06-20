export interface Book {
  _id: string;
  title: string;
  recipes: string[];
  author: string;
  createdAt?: string;
  updatedAt?: string;
}
