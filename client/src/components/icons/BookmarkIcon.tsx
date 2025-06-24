import React from 'react';

interface BookmarkIconProps {
  filled?: boolean;
  size?: number;
  className?: string;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  filled = false,
  size = 24,
  className = '',
}) => {
  const baseClass = 'block mx-auto';
  return filled ? (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='#3b82f6' // Tailwind blue-500
      viewBox='0 0 24 24'
      stroke='#3b82f6'
      width={size}
      height={size}
      className={`${baseClass} ${className}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z'
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
      className={`${baseClass} text-blue-500 ${className}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z'
      />
    </svg>
  );
};

export default BookmarkIcon;
