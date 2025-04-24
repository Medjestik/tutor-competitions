import type { FC } from 'react';
import type { IPopupProps } from '../../../shared/components/Popup/interface/interface';

import icon from '../../../shared/icons/popup/success.png';

import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const RegistrationSuccessPopup: FC<IPopupProps> = ({ isOpen, onClose }) => {

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
      <h2 className='popup__title'>Регистрация успешно завершена!</h2>
      <p className='popup__subtitle'>Всем участникам вашей команды на указанные почты направлено письмо с логином и паролем для входа в учетную запись.</p>
      <p className='popup__subtitle'>Регистрироваться повторно участникам команды не нужно.</p>
      <p className='popup__subtitle'>Доступ в личный кабинет откроется после 15 сентября.</p>
      <Button style={btnStyle} text='Хорошо' onClick={onClose} />
    </Popup>
  );
};

export default RegistrationSuccessPopup;
