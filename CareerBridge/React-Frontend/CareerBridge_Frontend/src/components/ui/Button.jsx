import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform focus:outline-none focus:ring-4';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 focus:ring-blue-200 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 focus:ring-gray-200 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 focus:ring-green-200 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-105 focus:ring-blue-200'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;