import type { FC } from 'react';

import { getCurrentYear } from '../../../../../utils/getCurrentYear';
import { SOCIAL_MAX, SOCIAL_TG, SOCIAL_VK } from '../../../../../lib/lib';

import socialVk from '../../../../../images/social-vk.svg';
import socialMax from '../../../../../images/social-max.svg';
import socialTelegram from '../../../../../images/social-tg.svg';

import '../styles/style.css';

const LayoutFooter: FC = () => {
  return (
    <footer className='layout-footer'>
      <div className='layout-footer__left'>
        <span className='layout-footer__copy'>
          &copy; {getCurrentYear()} Российский университет транспорта РУТ (МИИТ)
        </span>
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
