import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  small?: boolean;
}

export function Button({ variant = 'primary', small, className = '', ...rest }: ButtonProps) {
  const variantClass = variant === 'ghost' ? 'btn--ghost' : '';
  const sizeClass = small ? 'btn--small' : '';
  return <button className={`btn ${variantClass} ${sizeClass} ${className}`.trim()} {...rest} />;
}
