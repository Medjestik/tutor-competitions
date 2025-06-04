import type { CSSProperties } from 'react';

export interface IButtonProps {
  text: string;
  width?: 'default' | 'full';
  color?: 'primary' | 'secondary' | 'white' | 'cancel' | 'inherit' | 'registration';
  style?: CSSProperties;
  type?: 'link' | 'button' | 'block';
  link?: string;
  onClick?: () => void;
}
