import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 bg-purple-700 text-white font-bold rounded-lg shadow-lg 
        hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-75 
        transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;