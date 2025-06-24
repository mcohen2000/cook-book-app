import React from 'react';

interface HeartIconProps {
  filled?: boolean;
  size?: number;
  className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  filled = false,
  size = 24,
  className = '',
}) => {
  const baseClass = 'block mx-auto';
  return filled ? (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='#ef4444'
      viewBox='0 0 24 24'
      stroke='#ef4444'
      width={size}
      height={size}
      className={`${baseClass} ${className}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
      />
    </svg>
  ) : (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      width={size}
      height={size}
      className={`${baseClass} text-red-500 ${className}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
      />
    </svg>
  );
};

export default HeartIcon;
