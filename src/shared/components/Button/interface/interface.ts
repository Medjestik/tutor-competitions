import type { CSSProperties } from 'react';

export interface IButtonProps {
  text: string;
  width?: 'default' | 'full';
  color?: 'primary' | 'secondary' | 'white' | 'cancel';
  style?: CSSProperties;
  type?: 'link' | 'button';
  link?: string;
  onClick?: () => void;
}
