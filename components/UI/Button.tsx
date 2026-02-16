import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  withIcon = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 shadow-sm hover:shadow-md focus:ring-slate-900",
    secondary: "bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-0.5 shadow-sm hover:shadow-md focus:ring-primary-600",
    outline: "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-500",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent"
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-base px-5 py-2.5 gap-2",
    lg: "text-lg px-7 py-3.5 gap-2.5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {withIcon && <ArrowRight className="w-4 h-4" />}
    </button>
  );
};

export default Button;