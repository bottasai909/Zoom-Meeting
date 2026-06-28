import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 text-sm';
  
  const variants = {
    primary: 'bg-zoom-blue hover:bg-zoom-blueHover text-white disabled:bg-opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10',
    secondary: 'bg-zoom-button hover:bg-opacity-80 text-white disabled:bg-opacity-50 disabled:cursor-not-allowed border border-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/10',
    ghost: 'hover:bg-zoom-button text-gray-300 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
