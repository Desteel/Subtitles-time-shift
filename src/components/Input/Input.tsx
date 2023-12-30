import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import './Input.css';

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
};

export function Input({ label, ...inputProps }: InputProps) {
  return (
    <label>
      <div>{label}</div>
      <input {...inputProps} className="input" />
    </label>
  );
}
