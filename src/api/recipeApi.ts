// src/api/recipeApi.ts
import { api } from "./client";
import type { Recipe, PaginatedResponse, RecipeFormData } from "@/types/recipe";

export const recipeApi = {
  list: (page = 1, limit = 10) =>
    api
      .get<PaginatedResponse>("/recipes", { params: { page, limit } })
      .then((r) => r.data),

  search: (q: string, page = 1, limit = 10) =>
    api
      .get<PaginatedResponse>("/recipes/search", { params: { q, page, limit } })
      .then((r) => r.data),

  get: (id: string) =>
    api.get<Recipe>(`/recipes/${id}`).then((r) => r.data),

  create: (data: RecipeFormData) =>
    api.post<Recipe>("/recipes", data).then((r) => r.data),

  update: (id: string, data: Partial<RecipeFormData>) =>
    api.put<Recipe>(`/recipes/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete<{ message: string }>(`/recipes/${id}`).then((r) => r.data),
};
