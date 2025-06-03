import type { FC } from 'react';

import Navigation from '../../../../../shared/components/Navigation/ui/Navigation';
import { getCurrentYear } from '../../../../../shared/utils/getCurrentYear';
import { NavFooterLinks } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IFooterProps {
  windowWidth: number;
}

const Footer: FC<IFooterProps> = ({ windowWidth }) => {

  console.log(windowWidth);

  return (
    <footer className='footer' id='footer'>
      <div className='footer__navigation'>
        <Navigation links={NavFooterLinks} color='white' direction='column' />
        <p className='footer__support'>При проблемах с регистрацией обращайтесь в <a className='footer__support-link' href='https://t.me/+D6SRLrFPgDgyZGQ6' target='_blank'>техническую поддержку</a></p>
      </div>
      <div className='footer__bottom'>
        <p className='footer__copy'>&copy; {getCurrentYear()}, Все права защищены РУТ (МИИТ)</p>
        <div className='footer__icons'>
          <a
            href='https://t.me/+D6SRLrFPgDgyZGQ6'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Telegram'
            className='footer__icon-link'
          >
            <div className='footer__icon footer__icon_type_telegram'></div>
          </a>
          <a
            href='mailto:cpds@miit.ru'
            aria-label='Mail'
            className='footer__icon-link'
          >
            <div className='footer__icon footer__icon_type_mail'></div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
