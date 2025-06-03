import type { FC } from 'react';

import Navigation from '../../../../../shared/components/Navigation/ui/Navigation';
import Icon from '../../../../../shared/components/Icon/ui/Icon';
import { NavHeaderLinks } from '../../../../../shared/components/Navigation/interface/interface';


import '../styles/style.css';

interface IMobileMenu {
  isShow: boolean;
  onClose: () => void;
}

const MobileMenu: FC<IMobileMenu> = ({ isShow, onClose }) => {
  return (
    <div className={`mobile-menu ${isShow ? 'mobile-menu_show' : ''}`}>
      <div className='mobile-menu__header'>
        <div className='header__icon'></div>
        <Icon type='close' color='white' onClick={onClose} />
      </div>
      <Navigation links={NavHeaderLinks} color='white' onClick={onClose} direction='column' />
    </div>
  );
};

export default MobileMenu;
