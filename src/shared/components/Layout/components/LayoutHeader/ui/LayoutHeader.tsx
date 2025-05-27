import { type FC, useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { CurrentUserContext } from '../../../../../context/team';

import Icon from '../../../../Icon/ui/Icon';

import logoRUT from '../../../../../icons/logo-rut.svg';

import { EROUTES } from '../../../../../utils/ERoutes';

import '../styles/style.css';

interface ILayoutHeaderProps {
  windowWidth: number;
  isLoggedIn: boolean;
  onLogout?: () => void;
}

const LayoutHeader: FC<ILayoutHeaderProps> = ({ windowWidth, isLoggedIn, onLogout }) => {

  const currentTeam = useContext(CurrentUserContext);

  const navigate = useNavigate();

  return (
    <header className='layout-header'>
      <div className='layout-header__icons'>
        <img className='layout-header__icon layout-header__icon-rut' src={logoRUT} alt='логотип'></img>
      </div>
      {
        isLoggedIn
        ?
        <>
        {
          windowWidth > 1000 &&
          <div className='layout-header__time'>
            <div className='layout-header__time-img'></div>
            <p className='layout-header__time-name'>{currentTeam.timezone}</p>
          </div>
        }
        {
          windowWidth > 1000 &&
          <div className='layout-header__user'>
            <div className='layout-header__user-img'></div>
            <p className='layout-header__user-name'>{currentTeam.username}</p>
          </div>
        }
        {
          windowWidth > 1000 
          ?
          <button className='layout-header__btn' type='button' onClick={onLogout}>Выход</button>
          :
          <Icon type='logout' onClick={onLogout} />
        }

        </>
        :
        <>
        {
          windowWidth > 1000
          ?
          <button className='layout-header__btn' type='button' onClick={() => navigate(EROUTES.LANDING)}>На главную</button>
          :
          <Icon type='home' onClick={() => navigate(EROUTES.LANDING)} />
        }
        </>
      }
    </header>
  );
};

export default LayoutHeader;
