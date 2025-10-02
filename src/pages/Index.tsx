import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe, PaginatedResponse } from '@/types/recipe';
import { recipeApi } from '@/services/recipeApi';
import { RecipeCard } from '@/components/RecipeCard';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecipes();
  }, [page]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data: PaginatedResponse = await recipeApi.getAll(page, 12);
      setRecipes(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las recetas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(async () => {
      if (query.trim() === '') {
        loadRecipes();
      } else {
        try {
          setLoading(true);
          const data = await recipeApi.search(query, 1, 12);
          setRecipes(data.results);
          setTotalPages(data.totalPages);
          setPage(1);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Error al buscar recetas',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta receta?')) return;

    try {
      await recipeApi.delete(id);
      toast({
        title: 'Éxito',
        description: 'Receta eliminada correctamente',
      });
      loadRecipes();
    } catch (error) {
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
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-muted-foreground">Cargando recetas...</p>
          </div>
        ) : recipes.length === 0 ? (
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

            {/* Pagination */}
            {!searchQuery && totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center px-4 text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
