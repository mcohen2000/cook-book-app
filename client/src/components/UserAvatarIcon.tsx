interface UserAvatarIconProps {
  name?: string;
  className?: string;
}

const UserAvatarIcon = ({ name, className = '' }: UserAvatarIconProps) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${className}`}
  >
    {name ? name.charAt(0).toUpperCase() : 'U'}
  </div>
);

export default UserAvatarIcon;
