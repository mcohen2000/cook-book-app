import React from 'react';

const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M4 6h16M4 12h16M4 18h16'
    />
  </svg>
);

export default HamburgerIcon;
