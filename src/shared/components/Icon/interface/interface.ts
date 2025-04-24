import type { CSSProperties } from 'react';

export interface IIconProps {
  type: 'edit' | 'remove' | 'menu' | 'close' | 'home' | 'logout';
  color?: 'primary' | 'secondary' | 'white' | 'cancel';
  width?: '32' | '24';
  style?: CSSProperties;
  onClick?: () => void;
}
