import type { FC } from 'react';

import iconArrow from '../../../../../shared/images/person-cabinet/icon-arrow-right.svg';
import { SOCIAL_MAX } from '../../../../../shared/lib/lib';

import '../styles/channel-banner.css';

interface IPersonChannelBannerProps {
  href?: string;
}

const PersonChannelBanner: FC<IPersonChannelBannerProps> = ({
  href = SOCIAL_MAX,
}) => {
  return (
    <div className='person-channel'>
      <div className='person-channel__text'>
        <p className='person-channel__title'>Чат в MAX</p>
        <p className='person-channel__desc'>
          Следите за новостями конкурса в MAX: сроки, ответы на вопросы, нюансы и советы
        </p>
      </div>
      <a className='person-channel__btn' href={href} target='_blank' rel='noreferrer'>
        <span className='person-channel__btn-label'>Подписаться</span>
        <span className='person-channel__btn-icon' aria-hidden='true'>
          <img src={iconArrow} alt='' />
        </span>
      </a>
    </div>
  );
};

export default PersonChannelBanner;
