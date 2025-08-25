import React from 'react';
import { Link } from 'react-router';
import ChefHatIcon from './icons/ChefHatIcon';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label='Mobile Navigation Drawer'
      >
        <div className='flex flex-col h-full p-6'>
          <Link
            to='/'
            onClick={onClose}
            className='flex items-center space-x-2 mb-8'
          >
            <ChefHatIcon
              color='#2b7fff'
              className='w-[32px] min-w-[32px] h-[32px] min-h-[32px]'
            />
            <h2 className='text-xl font-bold text-blue-500 hover:text-blue-600 transition-colors'>
              Cook Book
            </h2>
          </Link>
          <Link
            to='/recipes'
            className='mb-4 text-gray-700 hover:text-blue-600 text-lg font-medium'
            onClick={onClose}
          >
            Recipes
          </Link>
          <Link
            to='/cookbooks'
            className='mb-4 text-gray-700 hover:text-blue-600 text-lg font-medium'
            onClick={onClose}
          >
            Cookbooks
          </Link>
        </div>
      </nav>
    </>
  );
};

export default SideDrawer;
