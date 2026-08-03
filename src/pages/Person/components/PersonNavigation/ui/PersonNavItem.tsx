import type { FC } from 'react';

import iconRocket from '../../../../../shared/images/person-cabinet/icon-rocket.svg';
import iconArrow from '../../../../../shared/images/person-cabinet/icon-arrow-active.svg';

import '../styles/person-nav-item.css';

export type TPersonNavItemState = 'active' | 'default' | 'block';

interface IPersonNavItemProps {
  title: string;
  description?: string;
  number?: string;
  state: TPersonNavItemState;
  isHome?: boolean;
  onClick?: () => void;
}

const PersonNavItem: FC<IPersonNavItemProps> = ({
  title,
  description,
  number,
  state,
  isHome = false,
  onClick,
}) => {
  const isClickable = state !== 'block' && Boolean(onClick);

  return (
    <li
      className={`person-nav-item person-nav-item_state_${state}`}
      onClick={isClickable ? onClick : undefined}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {
        isHome && state === 'active'
        ?
        <div className='person-nav-item__badge person-nav-item__badge_active'>
          <img className='person-nav-item__arrow' src={iconArrow} alt='' />
          <img className='person-nav-item__rocket' src={iconRocket} alt='' />
        </div>
        :
        <div className='person-nav-item__badge'>
          {
            isHome
            ?
            <img className='person-nav-item__rocket person-nav-item__rocket_muted' src={iconRocket} alt='' />
            :
            <span className='person-nav-item__number'>{number}</span>
          }
        </div>
      }
      <div className='person-nav-item__text'>
        <p className={`person-nav-item__title${state === 'active' ? ' person-nav-item__title_active' : ''}`}>
          {title}
        </p>
        {
          description &&
          <p className={`person-nav-item__desc${state === 'active' ? ' person-nav-item__desc_active' : ''}`}>
            {description}
          </p>
        }
      </div>
    </li>
  );
};

export default PersonNavItem;
