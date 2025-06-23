import CookbookForm from '../components/CookbookForm';

const CreateCookbook = () => {
  return (
    <div className='max-w-xl mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>Create Cookbook</h1>
      <CookbookForm />
    </div>
  );
};

export default CreateCookbook;
