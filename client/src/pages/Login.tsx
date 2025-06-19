import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import BackButton from '../components/BackButton';
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/userService';
import { useQueryClient } from '@tanstack/react-query';

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/recipes');
    },
    onError: (err: any) => {
      setError(err.message || 'Error logging in');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <BackButton to='/' text='Cancel' />
      </div>
      <div className='bg-white rounded-xl shadow-lg p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Welcome Back</h1>
          <p className='mt-2 text-gray-600'>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {(error || mutation.isError) && (
            <div className='bg-red-50 text-red-500 p-3 rounded-md'>{error}</div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div className='flex justify-between items-center'>
            <Link to='/register' className='text-blue-500 hover:text-blue-600'>
              Create an account
            </Link>
            <button
              type='submit'
              className='px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white transition-colors bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60'
              disabled={
                !formData.email || !formData.password || mutation.isPending
              }
            >
              {mutation.isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
