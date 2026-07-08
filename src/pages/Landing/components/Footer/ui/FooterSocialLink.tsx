import type { FC } from 'react';
import type { IFooterSocialLinkProps } from '../interface/interface';

import vkIcon from '../../../../../shared/images/social-vk.svg';
import maxIcon from '../../../../../shared/images/social-max.svg';
import telegramIcon from '../../../../../shared/images/social-tg.svg';

import { getCurrentYear } from '../../../../../shared/utils/getCurrentYear';

import '../styles/style.css';

const FooterSocialLink: FC<IFooterSocialLinkProps> = ({ withCopy = true }) => {

  return (
    <div className='footer__social'>
      {
        withCopy &&
        <p className='footer__copy'>&copy; {getCurrentYear()}, Все права защищены РУТ (МИИТ)</p>
      }
      <ul className='footer__social-icons'>
        <a className='footer__social-link' href={'/'} target='_blank'>
          <img className='footer__social-icon' src={vkIcon} alt='icon' />
        </a>
        <a className='footer__social-link' href={'/'} target='_blank'>
          <img className='footer__social-icon' src={maxIcon} alt='icon' />
        </a>
        <a className='footer__social-link' href={'/'} target='_blank'>
          <img className='footer__social-icon' src={telegramIcon} alt='icon' />
        </a>
      </ul>
    </div>
  );
};

export default FooterSocialLink;
