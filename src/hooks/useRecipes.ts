// src/hooks/useRecipes.ts
import { useState, useEffect, useCallback } from "react";
import { recipeApi } from "@/api/recipeApi";
import { handleApiError } from "@/services/errorHandler";
import type { Recipe, RecipeFormData, PaginatedResponse } from "@/types/recipe";

interface UseRecipesOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

interface UseRecipesResult {
  recipes: Recipe[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  searchQuery: string;
  setSearchQuery: (value: string) => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  createRecipe: (data: RecipeFormData) => Promise<Recipe | null>;
  updateRecipe: (id: string, data: Partial<RecipeFormData>) => Promise<Recipe | null>;
  deleteRecipe: (id: string) => Promise<void>;

  refetch: () => Promise<void>;

  getRecipe: (id: string) => Promise<Recipe | null>;
}

export function useRecipes(options: UseRecipesOptions = {}): UseRecipesResult {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSearch = "",
  } = options;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchQueryState, setSearchQueryState] = useState<string>(initialSearch);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapper para la búsqueda: cuando cambias el search, volvemos a la página 1
  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
    setPage(1);
  }, []);

  // Esta función hace la llamada a la API (list o search) según haya búsqueda o no
  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data: PaginatedResponse;

      const trimmedQuery = searchQueryState.trim();
      if (trimmedQuery) {
        // Modo búsqueda
        data = await recipeApi.search(trimmedQuery, page, limit);
      } else {
        // Modo listado normal
        data = await recipeApi.list(page, limit);
      }

      setRecipes(data.results);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      handleApiError(err);
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQueryState]);

  // refetch simplemente vuelve a ejecutar loadRecipes
  const refetch = useCallback(async () => {
    await loadRecipes();
  }, [loadRecipes]);

  // Cargar recetas automáticamente cuando cambien page / limit / searchQuery
  useEffect(() => {
    // Aquí no usamos el flag "cancelled" por simplicidad.
    // Si quisieras, podríamos añadirlo luego.
    void loadRecipes();
  }, [loadRecipes]);

  // --- CRUD ---

  const createRecipe = useCallback(
    async (data: RecipeFormData): Promise<Recipe | null> => {
      setLoading(true);
      setError(null);

      try {
        const created = await recipeApi.create(data);
        // Tras crear, recargamos la lista (respetando página/búsqueda actual)
        await refetch();
        return created;
      } catch (err) {
        handleApiError(err);
        setError("Failed to create recipe");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [refetch]
  );

  const updateRecipe = useCallback(
    async (
      id: string,
      data: Partial<RecipeFormData>
    ): Promise<Recipe | null> => {
      setLoading(true);
      setError(null);

      try {
        const updated = await recipeApi.update(id, data);
        // Podríamos actualizar el estado localmente,
        // pero refetch te garantiza coherencia con el backend.
        await refetch();
        return updated;
      } catch (err) {
        handleApiError(err);
        setError("Failed to update recipe");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [refetch]
  );

  const deleteRecipe = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await recipeApi.remove(id);
        // Volvemos a cargar la página actual
        await refetch();
      } catch (err) {
        handleApiError(err);
        setError("Failed to delete recipe");
      } finally {
        setLoading(false);
      }
    },
    [refetch]
  );

  const getRecipe = useCallback(
    async (id: string): Promise<Recipe | null> => {
      setError(null);
  
      try {
        const recipe = await recipeApi.get(id);
        return recipe;
      } catch (err) {
        handleApiError(err, "Failed to get recipe");
        setError("Failed to get recipe");
        return null;
      }
    },
    []
  );
  

  return {
    recipes,
    page,
    limit,
    total,
    totalPages,
    loading,
    error,
    searchQuery: searchQueryState,
    setSearchQuery,
    setPage,
    setLimit,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refetch,
    getRecipe
  };
}
