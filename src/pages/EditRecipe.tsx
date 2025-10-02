import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { recipeApi } from '@/services/recipeApi';
import { RecipeForm } from '@/components/RecipeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (formData: any) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await recipeApi.update(id, formData);
      toast({
        title: 'Éxito',
        description: 'Receta actualizada correctamente',
      });
      navigate(`/recipe/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la receta',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/recipe/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="shadow-xl">
          <div className="h-3 bg-gradient-to-r from-primary to-accent" />
          <CardHeader>
            <CardTitle className="text-2xl">Editar Receta</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeForm
              recipe={recipe}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/recipe/${id}`)}
              isLoading={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditRecipe;
