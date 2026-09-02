import { type FC, useEffect, useRef, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../../../../store/store';

import Icon from '../../../../Icon/ui/Icon';
import logoMintrans from '../../../../../images/person-cabinet/logo-mintrans.svg';
import logoMintransText from '../../../../../images/person-cabinet/logo-mintrans-text.svg';
import logoRut from '../../../../../images/person-cabinet/logo-rut-white.svg';
import logoLto from '../../../../../images/person-cabinet/logo-lto.svg';
import iconUser from '../../../../../images/person-cabinet/icon-user.svg';

import { EROUTES } from '../../../../../utils/ERoutes';
import { logoutUser } from '../../../../../../store/user/actions';

import '../styles/style.css';

const LayoutHeader: FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAdminZoneOpen, setIsAdminZoneOpen] = useState(false);
  const adminZoneRef = useRef<HTMLDivElement | null>(null);

  const isAdminZoneVisible = Boolean(user?.is_staff || user?.is_lms_tutor);
  const isDesktopHeader = windowWidth > 1000;
  const homeRoute = user ? EROUTES.PERSON : EROUTES.LANDING;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <Link className='layout-header__logo-link' to={homeRoute} aria-label='На главную'>
          <div className='layout-header__logo-mintrans'>
            <img className='layout-header__logo-mintrans-icon' src={logoMintrans} alt='Минтранс России' />
            <img className='layout-header__logo-mintrans-text' src={logoMintransText} alt='' />
          </div>
        </Link>
        <Link className='layout-header__logo-link' to={homeRoute} aria-label='На главную'>
          <img className='layout-header__logo-rut' src={logoRut} alt='Российский университет транспорта' />
        </Link>
        <Link className='layout-header__logo-link' to={homeRoute} aria-label='На главную'>
          <img className='layout-header__logo-lto' src={logoLto} alt='ЛТО' />
        </Link>
      </div>
      {
        user
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
                  {user.is_staff && (
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
