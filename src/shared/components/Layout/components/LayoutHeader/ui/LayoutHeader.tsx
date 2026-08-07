import { type FC } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../../../../store/store';

import Icon from '../../../../Icon/ui/Icon';
import logoMintrans from '../../../../../images/person-cabinet/logo-mintrans.svg';
import logoMintransText from '../../../../../images/person-cabinet/logo-mintrans-text.svg';
import logoRut from '../../../../../images/person-cabinet/logo-rut-white.svg';
import iconUser from '../../../../../images/person-cabinet/icon-user.svg';

import { EROUTES } from '../../../../../utils/ERoutes';
import { logoutUser } from '../../../../../../store/user/actions';

import '../styles/style.css';

const LayoutHeader: FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

  const formatUserShortName = () => {
    const lastName = user?.last_name?.trim();
    const firstInitial = user?.first_name?.trim()?.[0];
    const middleInitial = user?.middle_name?.trim()?.[0];

    if (!lastName && !firstInitial) {
      return user?.username;
    }

    const initials = [firstInitial, middleInitial]
      .filter(Boolean)
      .map((letter) => `${letter?.toUpperCase()}.`)
      .join('');

    return [lastName, initials].filter(Boolean).join(' ');
  };

  const handleLogout = () => {
		dispatch(logoutUser());
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
        user
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
            onClick={handleLogout}
          >
            Выход
          </button>
          <span className='layout-header__mobile-only'>
            <Icon type='logout' onClick={handleLogout} />
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
