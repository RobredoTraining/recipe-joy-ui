import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeApi } from '@/services/recipeApi';
import { RecipeForm } from '@/components/RecipeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setSubmitting(true);
      const newRecipe = await recipeApi.create(formData);
      toast({
        title: 'Éxito',
        description: 'Receta creada correctamente',
      });
      navigate(`/recipe/${newRecipe._id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la receta',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
            <RecipeForm
              onSubmit={handleSubmit}
              onCancel={() => navigate('/')}
              isLoading={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRecipe;
