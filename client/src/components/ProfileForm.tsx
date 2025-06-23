import { useState, useEffect } from 'react';
import { useUpdateProfile } from '../queries/useUsers';

interface ProfileFormProps {
  currentName: string;
  onSuccess: () => void;
}

const ProfileForm = ({ currentName, onSuccess }: ProfileFormProps) => {
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(currentName);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update local state when currentName prop changes
  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      await updateProfile.mutateAsync({ name: name.trim() });
      setSuccess('Profile updated successfully!');
      setError('');
      setIsEditing(false);
      onSuccess();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setSuccess('');
    }
  };

  const handleCancel = () => {
    setName(currentName);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className='border-t pt-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-medium text-gray-900'>Name</h3>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium'
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className='space-y-4'>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter your name'
            autoFocus
          />
          <div className='flex space-x-3'>
            <button
              onClick={handleSave}
              disabled={
                updateProfile.isPending ||
                !name.trim() ||
                name.trim() === currentName.trim()
              }
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {updateProfile.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateProfile.isPending}
              className='px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className='text-gray-700'>{currentName}</p>
      )}

      {/* Messages */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      )}
      {success && (
        <div className='bg-green-50 border border-green-200 rounded-md p-4'>
          <p className='text-green-600 text-sm'>{success}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
