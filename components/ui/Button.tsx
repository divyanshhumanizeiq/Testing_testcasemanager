import React from 'react';
import Icon from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  iconName?: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, iconName, variant = 'primary', onClick, ...props }) => {
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400',
    secondary: 'bg-gray-600 text-gray-200 hover:bg-gray-500 disabled:bg-gray-700',
  };

  const className = `${baseClasses} ${variantClasses[variant]} ${props.className || ''}`;

  return (
    <button {...props} onClick={onClick} className={className}>
      {iconName && <Icon name={iconName} className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;