import type { PropsWithChildren, } from 'react';

export interface ILayoutProps extends PropsWithChildren {
  containerWidth?: 'small' | 'medium' | 'full' | 'default' | 'mobile';
  mainContainer?: boolean;
  /** Прозрачный main без белой карточки (ЛК по новому макету) */
  transparentMain?: boolean;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}
