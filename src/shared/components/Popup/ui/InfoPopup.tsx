import type { FC } from 'react';
import type { IInfoPopupProps } from '../interface/interface'; 

import Popup from './Popup';
import Button from '../../Button/ui/Button';

import '../styles/style.css';

const InfoPopup: FC<IInfoPopupProps> = ({ isOpen, onClose, title, text }) => {

  const btnStyle = {
    width: '100%',
    margin: '20px 0 0 0',
    padding: '8px 14px',
    height: '40px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium'>
      <h2 className='popup__title'>{title}</h2>
      <p className='popup__subtitle'>{text}</p>
      <Button style={btnStyle} text='Хорошо' onClick={onClose} />
    </Popup>
  );
};

export default InfoPopup;
