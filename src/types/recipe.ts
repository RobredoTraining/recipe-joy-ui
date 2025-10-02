export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
}

export interface PaginatedResponse {
  total: number;
  page: number;
  totalPages: number;
  results: Recipe[];
}
