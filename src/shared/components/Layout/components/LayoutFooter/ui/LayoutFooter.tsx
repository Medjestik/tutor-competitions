import type { FC } from 'react';

import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CurrentUserContext } from '../../../../../context/team';
import { getCurrentYear } from '../../../../../utils/getCurrentYear';
import { EROUTES } from '../../../../../utils/ERoutes';
import { SOCIAL_MAX, SOCIAL_TG, SOCIAL_VK } from '../../../../../lib/lib';

import socialVk from '../../../../../images/social-vk.svg';
import socialMax from '../../../../../images/social-max.svg';
import socialTelegram from '../../../../../images/social-tg.svg';

import '../styles/style.css';

const LayoutFooter: FC = () => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <footer className='layout-footer'>
      <div className='layout-footer__left'>
        <span className='layout-footer__copy'>
          &copy; {getCurrentYear()} Российский университет транспорта РУТ (МИИТ)
        </span>
        {currentUser.is_staff && (
          <ul className='layout-footer__nav'>
            <li>
              <Link
                className='layout-footer__nav-link'
                to={EROUTES.STAFF_LEARNING_APPLICATIONS}
              >
                Заявки на обучение
              </Link>
            </li>
            <li>
              <Link className='layout-footer__nav-link' to={EROUTES.STAFF_LMS}>
                Конструктор LMS
              </Link>
            </li>
          </ul>
        )}
      </div>
      <ul className='layout-footer__social'>
        <li>
          <a className='layout-footer__social-link' href={SOCIAL_VK} target='_blank' rel='noreferrer' aria-label='VK'>
            <img className='layout-footer__social-icon layout-footer__social-icon_vk' src={socialVk} alt='' />
          </a>
        </li>
        <li>
          <a className='layout-footer__social-link' href={SOCIAL_MAX} target='_blank' rel='noreferrer' aria-label='Max'>
            <img className='layout-footer__social-icon layout-footer__social-icon_max' src={socialMax} alt='' />
          </a>
        </li>
        <li>
          <a className='layout-footer__social-link' href={SOCIAL_TG} target='_blank' rel='noreferrer' aria-label='Telegram'>
            <img className='layout-footer__social-icon layout-footer__social-icon_tg' src={socialTelegram} alt='' />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default LayoutFooter;
