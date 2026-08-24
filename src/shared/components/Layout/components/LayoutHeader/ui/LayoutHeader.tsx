import { type FC, useContext, useEffect, useRef, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

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

const LayoutHeader: FC<ILayoutHeaderProps> = ({ windowWidth, isLoggedIn, onLogout }) => {
  const currentTeam = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const isAdminZoneVisible = currentTeam.is_staff || currentTeam.is_lms_tutor;
  const isDesktopHeader = windowWidth > 1000;
  const homeRoute = isLoggedIn ? EROUTES.PERSON : EROUTES.LANDING;
  const [isAdminZoneOpen, setIsAdminZoneOpen] = useState<boolean>(false);
  const adminZoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocumentPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!adminZoneRef.current) {
        return;
      }

      const target = event.target as Node | null;
      if (!target || !adminZoneRef.current.contains(target)) {
        setIsAdminZoneOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentPointerDown);
    document.addEventListener('touchstart', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentPointerDown);
      document.removeEventListener('touchstart', handleDocumentPointerDown);
    };
  }, []);

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
        <Link className='layout-header__logo-link' to={homeRoute} aria-label='На главную'>
          <div className='layout-header__logo-mintrans'>
            <img className='layout-header__logo-mintrans-icon' src={logoMintrans} alt='Минтранс России' />
            <img className='layout-header__logo-mintrans-text' src={logoMintransText} alt='' />
          </div>
        </Link>
        <Link className='layout-header__logo-link' to={homeRoute} aria-label='На главную'>
          <img className='layout-header__logo-rut' src={logoRut} alt='Российский университет транспорта' />
        </Link>
      </div>
      {
        isLoggedIn
        ?
        <div className='layout-header__actions'>
          {isAdminZoneVisible && isDesktopHeader && (
            <div ref={adminZoneRef} className='layout-header__admin-dropdown layout-header__desktop-only'>
              <button
                className='layout-header__btn layout-header__admin-toggle'
                type='button'
                onClick={() => setIsAdminZoneOpen((prev) => !prev)}
                aria-expanded={isAdminZoneOpen}
              >
                ADMIN-ZONE
              </button>

              <nav className='layout-header__admin-zone' aria-label='Админ-зона'>
                <ul className={`layout-header__admin-nav ${isAdminZoneOpen ? 'layout-header__admin-nav_open' : ''}`}>
                  {currentTeam.is_staff && (
                    <>
                      <li>
                        <Link
                          className='layout-header__admin-link'
                          to={EROUTES.STAFF_LEARNING_APPLICATIONS}
                          onClick={() => setIsAdminZoneOpen(false)}
                        >
                          Заявки на обучение
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='layout-header__admin-link'
                          to={EROUTES.STAFF_LMS}
                          onClick={() => setIsAdminZoneOpen(false)}
                        >
                          Конструктор LMS
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='layout-header__admin-link'
                          to={EROUTES.STAFF_SETTINGS}
                          onClick={() => setIsAdminZoneOpen(false)}
                        >
                          Settings
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      className='layout-header__admin-link'
                      to={EROUTES.STAFF_TASK_REVIEWS}
                      onClick={() => setIsAdminZoneOpen(false)}
                    >
                      Проверка заданий
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
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
            onClick={() => navigate(EROUTES.LOGIN)}
          >
            Вход
          </button>
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
