import type { FC } from 'react';
import type { IPopupProps } from '../../../shared/components/Popup/interface/interface';

import icon from '../../../shared/icons/popup/error.png';

import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const RegistrationErrorPopup: FC<IPopupProps> = ({ isOpen, onClose }) => {

  const btnStyle = {
    width: '100%',
    margin: '20px 0 0 0',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='small'>
      <img className='popup__icon' src={icon} alt={'иконка'}></img>
      <h2 className='popup__title'>К сожалению, произошла ошибка!</h2>
      <p className='popup__subtitle'>Попробуйте позже или обратитесь в техническую поддержку.</p>
      <Button style={btnStyle} text='Понятно' onClick={onClose} />
    </Popup>
  );
};

export default RegistrationErrorPopup;
