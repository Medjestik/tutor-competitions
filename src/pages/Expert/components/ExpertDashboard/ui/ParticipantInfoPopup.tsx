import { useState, type FC } from 'react';
import type { IParticipant } from '../interface/interface';

import Popup from '../../../../../shared/components/Popup/ui/Popup';
import Button from '../../../../../shared/components/Button/ui/Button';

import { nominationMap } from '../../../../../shared/utils/nominations';

import '../styles/style.css';

interface IParticipantInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentParticipants: IParticipant[];
  subtitleText: string;
  statusLabel: string;
}

const btnStyle = {
  width: '100%',
  margin: '20px 0 0 0',
  padding: '8px 14px',
  height: '40px',
  borderRadius: '12px',
  fontSize: '18px',
  lineHeight: '1',
};

const ParticipantInfoPopup: FC<IParticipantInfoPopupProps> = ({ 
  isOpen, 
  onClose, 
  currentParticipants, 
  subtitleText,
  statusLabel,
}) => {

  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedIndexes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium'>
      <h2 className='popup__title'>Участники ({statusLabel} - {currentParticipants.length})</h2>
      <p className='popup__subtitle'>{subtitleText}</p>
      <ul className='dashboard-participants__list'>
      {currentParticipants.map((elem, i) => {
        const isExpanded = expandedIndexes.has(i);
        const nominationName =
        elem.nomination && nominationMap[elem.nomination]
          ? nominationMap[elem.nomination]
          : 'Номинация не выбрана';

        return (
          <li className='dashboard-participants__item' key={i}>
            <div className='dashboard-participants__top' onClick={() => toggleExpanded(i)}>
              <div className='dashboard-participants__user'></div>
              <div className='dashboard-participants__info'>
                <h4 className='dashboard-participants__name'>{elem.fullname}</h4>
              </div>
              <div className={`dashboard-participants__arrow ${isExpanded ? 'open' : ''}`} />
            </div>
            {isExpanded && (
              <div className='dashboard-participants__bottom'>
                {
                  subtitleText === 'Другие университеты' && 
                  <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Университет: </span>{elem.educational_organization}</p>
                }
                <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Должность: </span>{elem.main_position}</p>
                <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Часовой пояс: </span>{elem.timezone}</p>
                <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Почта: </span>{elem.email}</p>
                <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Телефон: </span>{elem.phone_number}</p>
                <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Номинация: </span>{nominationName}</p>
                <p className='dashboard-participants__text'><span className='dashboard-participants__text_weight_bold'>Практика: </span> {elem.isSubmitted ? elem.form_name : 'Анкета не отправлена'}</p>
              </div>
            )}
          </li>
        );
      })}
      </ul>

      <Button style={btnStyle} text='Закрыть' onClick={onClose} />
    </Popup>
  );
};

export default ParticipantInfoPopup;
