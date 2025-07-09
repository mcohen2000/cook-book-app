interface DownwardArrowIconProps {
  className?: string;
}

const DownwardArrowIcon = ({ className = '' }: DownwardArrowIconProps) => (
  <svg
    className={`w-4 h-4 transition-transform ${className}`}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M19 9l-7 7-7-7'
    />
  </svg>
);

export default DownwardArrowIcon;
