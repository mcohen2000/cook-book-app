import { Link } from 'react-router';

interface BackButtonProps {
  to: string;
  text: string;
}

export default function BackButton({ to, text }: BackButtonProps) {
  return (
    <Link
      to={to}
      className='text-gray-600 hover:text-blue-600 px-4 py-2 inline-flex items-center transition-colors'
    >
      <svg
        className='w-5 h-5 mr-2'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10 19l-7-7m0 0l7-7m-7 7h18'
        />
      </svg>
      {text}
    </Link>
  );
}
