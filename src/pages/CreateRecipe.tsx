import { useNavigate } from 'react-router-dom';
import { RecipeForm } from '@/components/RecipeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '@/hooks/useRecipes';        // <-- ✅ añadimos el hook

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { createRecipe, loading } = useRecipes();        // <-- ✅ sacamos createRecipe y loading del hook


  const handleSubmit = async (formData: any) => {
    try {

      const newRecipe = await createRecipe(formData);    // <-- ✅ sustituimos recipeApi.create
      if (!newRecipe) {
        // el hook ya hizo handleApiError
        toast({
          title: 'Error',
          description: 'No se pudo crear la receta',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Éxito',
        description: 'Receta creada correctamente',
      });

      navigate(`/recipe/${newRecipe._id}`);              // usamos la receta devuelta por el hook

    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la receta',
        variant: 'destructive',
      });
    } 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

      <Card className="shadow-xl">
        <div className="h-3 bg-gradient-to-r from-primary to-accent" />
        <CardHeader>
          <CardTitle className="text-2xl">Nueva Receta</CardTitle>
        </CardHeader>
        <CardContent>

          {/* 👇 Aquí usamos loading del hook o submitting */}
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isLoading={loading}           // <-- usa loading real del hook
          />

        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default CreateRecipe;