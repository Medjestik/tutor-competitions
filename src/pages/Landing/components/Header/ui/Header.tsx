import type { FC } from 'react';

import { Link } from 'react-scroll';

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
        <div className='header__icon'></div>
      </div>
      {
        windowWidth > 1000 
        ?
        <div className='header__navigation'>
          <Navigation links={NavHeaderLinks} color='white' />
          <div className='header__contacts'>
            <Link to='footer' smooth={true} offset={0} duration={1750} spy={true}>Контакты</Link>
          </div>
        </div>
        :
        <Icon type='menu' onClick={showMobileMenu} />
      }
    </header>
  );
};

export default Header;
