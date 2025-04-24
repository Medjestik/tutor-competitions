import type { FC } from 'react';

import iconRUT from '../../../../../shared/icons/logo-rut-white.svg';

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
        <img className='footer__icon footer__icon-rut' src={iconRUT} alt='логотип'></img>
        <Icon type='close' color='white' onClick={onClose} />
      </div>
      <Navigation links={NavHeaderLinks} color='white' onClick={onClose} />
    </div>
  );
};

export default MobileMenu;
