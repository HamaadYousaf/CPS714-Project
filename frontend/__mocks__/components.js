import React from 'react';

// Mock the shadcn/ui components
export const Card = ({ children, className }) => <div data-testid="card" className={className}>{children}</div>;
export const CardHeader = ({ children }) => <div data-testid="card-header">{children}</div>;
export const CardTitle = ({ children, className }) => <div data-testid="card-title" className={className}>{children}</div>;
export const CardContent = ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>;
export const Button = ({ children, className, onClick, disabled }) => (
  <button 
    data-testid="button"
    className={className} 
    onClick={onClick} 
    disabled={disabled}
  >
    {children}
  </button>
);

// Mock the Lucide icons
export const BadgeCheck = ({ className }) => <div data-testid="badge-check" className={className}>BadgeCheck Icon</div>;
export const Loader2 = ({ className }) => <div data-testid="loader" className={className}>Loader Icon</div>;