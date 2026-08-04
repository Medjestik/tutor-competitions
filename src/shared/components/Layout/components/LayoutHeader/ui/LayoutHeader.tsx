import { type FC, useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { CurrentUserContext } from '../../../../../context/team';

import Icon from '../../../../Icon/ui/Icon';

import { EROUTES } from '../../../../../utils/ERoutes';

import logoMintrans from '../../../../../images/person-cabinet/logo-mintrans.svg';
import logoMintransText from '../../../../../images/person-cabinet/logo-mintrans-text.svg';
import logoRut from '../../../../../images/person-cabinet/logo-rut-white.svg';
import iconUser from '../../../../../images/person-cabinet/icon-user.svg';

import '../styles/style.css';

interface ILayoutHeaderProps {
  windowWidth: number;
  isLoggedIn: boolean;
  onLogout?: () => void;
}

const LayoutHeader: FC<ILayoutHeaderProps> = ({ isLoggedIn, onLogout }) => {
  const currentTeam = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const formatUserShortName = () => {
    const lastName = currentTeam.last_name?.trim();
    const firstInitial = currentTeam.first_name?.trim()?.[0];
    const middleInitial = currentTeam.middle_name?.trim()?.[0];

    if (!lastName && !firstInitial) {
      return currentTeam.username;
    }

    const initials = [firstInitial, middleInitial]
      .filter(Boolean)
      .map((letter) => `${letter?.toUpperCase()}.`)
      .join('');

    return [lastName, initials].filter(Boolean).join(' ');
  };

  return (
    <header className='layout-header'>
      <div className='layout-header__logos'>
        <div className='layout-header__logo-mintrans'>
          <img className='layout-header__logo-mintrans-icon' src={logoMintrans} alt='Минтранс России' />
          <img className='layout-header__logo-mintrans-text' src={logoMintransText} alt='' />
        </div>
        <img className='layout-header__logo-rut' src={logoRut} alt='Российский университет транспорта' />
      </div>
      {
        isLoggedIn
        ?
        <div className='layout-header__actions'>
          <div className='layout-header__lang layout-header__desktop-only' aria-label='Язык'>
            <span className='layout-header__lang-item layout-header__lang-item_active'>RU</span>
            <span className='layout-header__lang-divider'>/</span>
            <span className='layout-header__lang-item'>EN</span>
          </div>
          <div className='layout-header__user layout-header__desktop-only'>
            <img className='layout-header__user-img' src={iconUser} alt='' />
            <p className='layout-header__user-name'>{formatUserShortName()}</p>
          </div>
          <button
            className='layout-header__btn layout-header__desktop-only'
            type='button'
            onClick={onLogout}
          >
            Выход
          </button>
          <span className='layout-header__mobile-only'>
            <Icon type='logout' onClick={onLogout} />
          </span>
        </div>
        :
        <>
          <button
            className='layout-header__btn layout-header__desktop-only'
            type='button'
            onClick={() => navigate(EROUTES.LANDING)}
          >
            На главную
          </button>
          <span className='layout-header__mobile-only'>
            <Icon type='home' onClick={() => navigate(EROUTES.LANDING)} />
          </span>
        </>
      }
    </header>
  );
};

export default LayoutHeader;
