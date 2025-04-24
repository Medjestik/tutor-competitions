import type { PropsWithChildren, } from 'react';

export interface ILayoutProps extends PropsWithChildren {
  containerWidth?: 'small' | 'medium' | 'full' | 'default' | 'mobile';
  mainContainer?: boolean;
  windowWidth: number;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}
