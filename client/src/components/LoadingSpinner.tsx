interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner = ({ size = 8 }: LoadingSpinnerProps) => {
  const style = {
    height: `${size * 0.25}rem`,
    width: `${size * 0.25}rem`,
  };

  return (
    <div
      className='animate-spin rounded-full border-b-2 border-blue-600'
      style={style}
    ></div>
  );
};

export default LoadingSpinner;
