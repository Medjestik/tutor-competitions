import type { FC } from 'react';

import Navigation from '../../../../../shared/components/Navigation/ui/Navigation';
import Button from '../../../../../shared/components/Button/ui/Button';

import { NavFooterLinks } from '../../../../../shared/components/Navigation/interface/interface';
import FooterSocialLink from './FooterSocialLink';

import '../styles/style.css';

interface IFooterProps {
  windowWidth: number;
}


const Footer: FC<IFooterProps> = ({ windowWidth }) => {
    
  const btnLinksStyle = {
    margin: '0',
    width: windowWidth > 1000 ? '350px' : '100%',
    fontSize: windowWidth > 1000 ? '24px' : '18px',
    height: windowWidth > 1000 ? '60px' : '40px',
    lineHeight: '1',
    padding: '8px 20px',
  };
  
  return (
    <footer className='footer' id='footer'>
      <div className='footer__navigation'>
        <Navigation links={NavFooterLinks} color='white' direction='column' />
        <div className='footer__info'>
          <p className='footer__support'>Почта оргкомитета: <a className='footer__support-link' href='mailto:edtech@rut-miit.ru' target='_blank'>edtech@rut-miit.ru</a></p>
          <Button text='ЧАТ УЧАСТНИКОВ' color='primary' style={btnLinksStyle} />
        </div>
      </div>
      <FooterSocialLink />
      <div className='footer__background'></div>
    </footer>
  );
};

export default Footer;
