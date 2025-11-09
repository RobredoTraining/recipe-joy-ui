// src/hooks/useRecipes.ts
import { useState, useEffect } from "react";
import { recipeApi } from "@/api/recipeApi"; 
import { handleApiError } from "@/services/errorHandler";
import { type Recipe, type PaginatedResponse} from "@/types/recipe";

export function useRecipes(page = 1, limit = 10) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false; // 👈 bandera para evitar setState tras unmount

    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const data: PaginatedResponse = await recipeApi.list(page, limit);
        if (!ignore) {
          setRecipes(data.results);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        handleApiError(err);
        if (!ignore) setError("Failed to load recipes");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRecipes();

    return () => {
      ignore = true; // 👈 cleanup
    };
  }, [page, limit]);

  return { recipes, totalPages, loading, error };
}
