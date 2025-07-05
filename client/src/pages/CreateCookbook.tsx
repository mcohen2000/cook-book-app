import { useNavigate } from 'react-router';
import CookbookForm from '../components/CookbookForm';
import { useCreateCookbook } from '../queries/useBooks';

export default function CreateCookbook() {
  const navigate = useNavigate();
  const createCookbook = useCreateCookbook();

  const handleSubmit = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      await createCookbook.mutateAsync(data);
      navigate('/cookbooks');
    } catch (error) {
      console.error('Error creating cookbook:', error);
      throw error;
    }
  };

  return (
    <CookbookForm
      onSubmit={handleSubmit}
      title='Create New Cookbook'
      subtitle='Organize your favorite recipes into a collection'
      backTo='/cookbooks'
      backText='Back to Cookbooks'
      submitText='Create Cookbook'
      isSubmitting={createCookbook.isPending}
    />
  );
}
