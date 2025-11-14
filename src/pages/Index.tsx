// src/pages/Index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '@/components/RecipeCard';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '@/hooks/useRecipes';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 👉 Hook centralizado: lista + búsqueda + paginación + delete + refetch
  const {
    recipes,
    page,
    totalPages,
    total,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    setPage,
    deleteRecipe,
    refetch,
  } = useRecipes({ initialPage: 1, initialLimit: 12, initialSearch: '' });

  // Si quieres mantener el patrón “buscar al enviar”, usamos este estado local del input:
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Si tu SearchBar llama onSearch en cada cambio (con debounce interno), puedes pasar directamente setSearchQuery
  const handleSearch = (query: string) => {
    setLocalSearch(query);
    setSearchQuery(query); // dispara carga (el hook resetea a page=1)
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta receta?')) return;
    try {
      await deleteRecipe(id); // el hook ya recarga tras borrar
      toast({
        title: 'Éxito',
        description: 'Receta eliminada correctamente',
      });
    } catch {
      // deleteRecipe ya maneja error interno, pero mostramos toast “por si acaso”
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la receta',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Recetario</h1>
                <p className="text-white/90 text-sm">Organiza tus recetas favoritas</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/create')}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Receta
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Si tu SearchBar ya tiene debounce interno, basta con esto: */}
          <SearchBar onSearch={handleSearch} value={localSearch} />
          {/* Si tu SearchBar no acepta `value`, quita la prop y deja solo onSearch={handleSearch} */}
        </div>

        {/* Estado de carga / error */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <p className="text-muted-foreground">Cargando recetas...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-6">
            <p className="text-red-600 mb-2">{error}</p>
            <Button variant="outline" onClick={refetch}>Reintentar</Button>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span>
                {total} resultado{total === 1 ? '' : 's'}
                {searchQuery ? ` para “${searchQuery}”` : ''}
              </span>
              <span>Página {page} de {totalPages}</span>
            </div>

            {recipes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No se encontraron recetas' : 'No hay recetas todavía'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => navigate('/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear primera receta
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      onView={(id) => navigate(`/recipe/${id}`)}
                      onEdit={(id) => navigate(`/edit/${id}`)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {/* Paginación: la mantenemos oculta si hay búsqueda */}
                {!searchQuery && totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1 || loading}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center px-4 text-sm text-muted-foreground">
                      Página {page} de {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages || loading}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
