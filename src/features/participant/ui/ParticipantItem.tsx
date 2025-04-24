import type { FC } from 'react';
import type { IParticipantItemProps } from '../interface/interface';

import Icon from '../../../shared/components/Icon/ui/Icon';

import '../styles/style.css';

const ParticipantItem: FC<IParticipantItemProps> = ({ item, onEdit , onRemove, windowWidth }) => {

  return (
    <li className='participant__item'>
      {
        windowWidth > 1000
        ?
        <>
          <div className='participant__img'></div>
          <h4 className='participant__name'>{item.secondName} {item.firstName} {item.middleName}</h4>
          <p className='participant__phone'>Телефон: {item.phone}</p>
          <p className='participant__mail'>Почта: {item.mail}</p>
          <Icon type='edit' onClick={() => onEdit(item)} />
          <Icon type='remove' onClick={() => onRemove(item)} />
        </>
        :
        <>
          <div className='participant__img'></div>
          <h4 className='participant__name'>{item.secondName} {item.firstName} {item.middleName}</h4>
          <Icon type='edit' onClick={() => onEdit(item)} />
          <Icon type='remove' onClick={() => onRemove(item)} />
        </>
      }

    </li>
  );
};

export default ParticipantItem; 
