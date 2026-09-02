import type { FC } from 'react';

import Navigation from '../../../../../shared/components/Navigation/ui/Navigation';
import Button from '../../../../../shared/components/Button/ui/Button';

import { NavFooterLinks } from '../../../../../shared/components/Navigation/interface/interface';
import FooterSocialLink from './FooterSocialLink';

import { SOCIAL_MAX_CHAT } from '../../../../../shared/lib/lib';

import '../styles/style.css';

const Footer: FC = () => {
  return (
    <footer className='footer' id='footer'>
      <div className='footer__navigation'>
        <Navigation links={NavFooterLinks} color='white' direction='column' />
        <div className='footer__info'>
          <Button text='ЧАТ УЧАСТНИКОВ' color='gradient' type='link' href={SOCIAL_MAX_CHAT} />
          <p className='footer__support'>Почта оргкомитета: <a className='footer__support-link' href='mailto:edtech@rut-miit.ru' target='_blank'>edtech@rut-miit.ru</a></p>
        </div>
      </div>
      <FooterSocialLink />
      <div className='footer__background'></div>
    </footer>
  );
};

export default Footer;
