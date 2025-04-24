import type { FC } from 'react';
import type { IParticipantListProps, IParticipant } from '../interface/interface';

import ParticipantItem from './ParticipantItem';
import Button from '../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const ParticipantList: FC<IParticipantListProps> = ({ items, onAdd, onEdit, onRemove, windowWidth }) => {

  const btnStyle = {
    margin: '20px 0 0 0',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const btnMobileStyle = {
    margin: '12px 0 0 0',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '16px',
    lineHeight: '1',
  };

  return (
    <div className='participant'>
      {
        items.length > 0 
        ?
        <ul className='participant__list'>
          {
            items.map((item: IParticipant, i) => (
              <ParticipantItem item={item} key={i} onEdit={onEdit} onRemove={onRemove} windowWidth={windowWidth} />
            ))
          }
        </ul>
        :
        <span className='participant__empty'>Участники пока не добавлены!</span>
      }
      <Button style={windowWidth > 1000 ? btnStyle : btnMobileStyle} color='secondary' text='Добавить участника' onClick={onAdd} />
    </div>
  );
};

export default ParticipantList;
