import type { FC } from 'react';

import type { ILayoutProps } from '../interface/interface';

import LayoutHeader from '../components/LayoutHeader/ui/LayoutHeader';
import LayoutFooter from '../components/LayoutFooter/ui/LayoutFooter';

import '../styles/style.css';

const MainLayout: FC<ILayoutProps> = ({
  containerWidth = 'default',
  mainContainer = true,
  transparentMain = false,
  isLoggedIn = true,
  windowWidth,
  onLogout,
  children,
}) => {
  const mainClass = transparentMain
    ? 'layout__main layout__main_transparent'
    : 'layout__main';

  return (
    <div className={`layout${transparentMain ? ' layout_cabinet' : ''}`}>
      <div className='layout__grid' aria-hidden='true' />
      <div className={`layout__container layout__container_width_${containerWidth}`}>
        <LayoutHeader windowWidth={windowWidth} isLoggedIn={isLoggedIn} onLogout={onLogout} />
        <main className={mainClass}>
          {
            mainContainer
            ?
            <div className='layout__main-container'>
              {children}
            </div>
            :
            <>
              {children}
            </>
          }
        </main>
        <LayoutFooter />
      </div>
    </div>
  );
};

export default MainLayout;
