import type { FC } from 'react';

import icon from '../../../../../shared/icons/icon-white.png';
import iconRUT from '../../../../../shared/icons/logo-rut-white.svg';

import { ESOCIAL } from '../interface/interface';
import FooterSocialLink from './FooterSocialLink';
import Navigation from '../../../../../shared/components/Navigation/ui/Navigation';
import { getCurrentYear } from '../../../../../shared/utils/getCurrentYear';
import { NavFooterLinks } from '../../../../../shared/components/Navigation/interface/interface';
import { supportLink, telegramLink, vkLink, mailLink } from '../../../../../shared/utils/socail';

import '../styles/style.css';

interface IFooterProps {
  windowWidth: number;
}

const Footer: FC<IFooterProps> = ({ windowWidth }) => {
  return (
    <footer className='footer' id='footer'>
      <div className='footer__container'>
        <h2 className='footer__title'>Остались вопросы? Задайте их нам!</h2>
        {
          windowWidth > 1000
          ?
          <div className='footer__social'>
            <FooterSocialLink type={ESOCIAL.TELEGRAM} link={telegramLink} />
            <FooterSocialLink type={ESOCIAL.VK} link={vkLink} />
            <FooterSocialLink type={ESOCIAL.MAIL} link={mailLink} />
            <a className='footer__support' href={supportLink} target='_blank'>
              При проблемах с регистрацией 
              <br></br> 
              обращайтесь в <span className='footer__support-link'>техническую поддержку</span>.
            </a>
          </div>
          :
          <div className='footer__social-mobile'>
            <div className='footer__links-mobile'>
              <FooterSocialLink type={ESOCIAL.TELEGRAM} link={telegramLink} />
              <FooterSocialLink type={ESOCIAL.VK} link={vkLink} />
              <FooterSocialLink type={ESOCIAL.MAIL} link={mailLink} />
            </div>
            <a className='footer__support' href={supportLink} target='_blank'>При проблемах с регистрацией обращайтесь в <span className='footer__support-link'>техническую поддержку</span>.</a>
          </div>
        }
        <div className='footer__bottom'>
          {
            windowWidth > 1000 && <img className='footer__icon' src={icon} alt='логотип'></img>
          }
          <img className='footer__icon footer__icon-rut' src={iconRUT} alt='логотип'></img>
          <div className='footer__navigation'><Navigation links={NavFooterLinks} color='white' /></div>
        </div>
        <p className='footer__copy'>&copy; {getCurrentYear()}, Все права защищены РУТ (МИИТ)</p>
      </div>
    </footer>
  );
};

export default Footer;
