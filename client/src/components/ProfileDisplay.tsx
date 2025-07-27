import ProfileForm from './ProfileForm';

type ProfileDisplayProps = {
  user: any;
};

export default function ProfileDisplay({ user }: ProfileDisplayProps) {
  return (
    <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
      <div className='space-y-6'>
        {/* Avatar Section */}
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>{user.name}</h2>
            <p className='text-gray-600'>{user.email}</p>
          </div>
        </div>

        <ProfileForm currentName={user.name} />

        {/* Email Section (Read-only) */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Email</h3>
          <p className='text-gray-700'>{user.email}</p>
          <p className='text-sm text-gray-500 mt-1'>Email cannot be changed</p>
        </div>
      </div>
    </div>
  );
}
