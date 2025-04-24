import type { FC } from 'react';

import { Link } from 'react-scroll';

import icon from '../../../../../shared/icons/icon.svg';
import logoRUT from '../../../../../shared/icons/logo-rut.svg';
import Navigation from '../../../../../shared/components/Navigation/ui/Navigation';
import { NavHeaderLinks } from '../../../../../shared/components/Navigation/interface/interface';
import Icon from '../../../../../shared/components/Icon/ui/Icon';

import '../styles/style.css';

interface IHeaderProps {
  windowWidth: number;
  showMobileMenu: () => void;
}

const Header: FC<IHeaderProps> = ({ windowWidth, showMobileMenu }) => {

  return (
    <header className='header' id='header'>
      <div className='header__icons'>
        <img className='header__icon' src={icon} alt='логотип'></img>
        <img className='header__icon header__icon-rut' src={logoRUT} alt='логотип'></img>
      </div>
      {
        windowWidth > 1000 
        ?
        <>
        <Navigation links={NavHeaderLinks} color='default' />
        <div className='header__contacts'>
          <Link to='footer' smooth={true} offset={0} duration={1750} spy={true}>Контакты</Link>
        </div>
        </>
        :
        <Icon type='menu' onClick={showMobileMenu} />
      }
    </header>
  );
};

export default Header;
