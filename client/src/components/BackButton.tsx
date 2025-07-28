import { Link } from 'react-router';
import LeftArrowIcon from './icons/LeftArrowIcon';

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
      <LeftArrowIcon className='mr-2' />
      {text}
    </Link>
  );
}
