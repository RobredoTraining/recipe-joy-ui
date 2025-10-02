import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { recipeApi } from '@/services/recipeApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  const loadRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const data = await recipeApi.getById(recipeId);
      setRecipe(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar la receta',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe || !window.confirm('¿Estás seguro de eliminar esta receta?')) return;

    try {
      await recipeApi.delete(recipe._id);
      toast({
        title: 'Éxito',
        description: 'Receta eliminada correctamente',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la receta',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="shadow-xl border-2">
          <div className="h-3 bg-gradient-to-r from-primary to-accent" />
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{recipe.title}</CardTitle>
                {recipe.description && (
                  <CardDescription className="text-base">{recipe.description}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/edit/${recipe._id}`)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Ingredientes</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {recipe.instructions && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-primary">Instrucciones</h3>
                <p className="whitespace-pre-line bg-secondary/50 p-4 rounded-lg leading-relaxed">
                  {recipe.instructions}
                </p>
              </div>
            )}

            {recipe.createdAt && (
              <div className="pt-4 border-t text-sm text-muted-foreground">
                Creada: {new Date(recipe.createdAt).toLocaleDateString('es-ES')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
