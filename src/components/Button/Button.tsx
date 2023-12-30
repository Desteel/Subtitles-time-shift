import { ReactNode } from 'react';
import './Button.css';

export type ButtonProps = {
  onClick: () => void;
} & Partial<{
  children: ReactNode;
}>;

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
