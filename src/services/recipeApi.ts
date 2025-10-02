import { Recipe, RecipeFormData, PaginatedResponse } from '@/types/recipe';

const API_BASE_URL = 'http://localhost:3000/api/recipes';

export const recipeApi = {
  async getAll(page = 1, limit = 10): Promise<PaginatedResponse> {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  },

  async search(query: string, page = 1, limit = 10): Promise<PaginatedResponse> {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to search recipes');
    return response.json();
  },

  async getById(id: string): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch recipe');
    return response.json();
  },

  async create(data: RecipeFormData): Promise<Recipe> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return response.json();
  },

  async update(id: string, data: Partial<RecipeFormData>): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update recipe');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
  },
};
