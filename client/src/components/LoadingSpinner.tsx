interface LoadingSpinnerProps {
  size?: number;
  color?: 'blue' | 'red' | 'green' | 'white';
}

const colorMap = {
  blue: 'border-blue-600',
  red: 'border-red-600',
  green: 'border-green-600',
  white: 'border-white',
};

const LoadingSpinner = ({ size = 8, color = 'blue' }: LoadingSpinnerProps) => {
  const style = {
    height: `${size * 0.25}rem`,
    width: `${size * 0.25}rem`,
  };

  const colorClass = colorMap[color];

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${colorClass}`}
      style={style}
    ></div>
  );
};

export default LoadingSpinner;
