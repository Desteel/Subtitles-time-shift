import { ReactNode } from 'react';
import './Button.css';

export type ButtonProps = {
  onClick: () => void;
} & Partial<{
  disabled: boolean;
  children: ReactNode;
}>;

export function Button({ children, disabled, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="button" disabled={disabled}>
      {children}
    </button>
  );
}
