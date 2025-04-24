import type { FC } from 'react';
import type { IPopupProps } from '../../../shared/components/Popup/interface/interface';

import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';
import Link from '../../../shared/components/Link/ui/Link';

import telegramIcon from '../../../shared/icons/telegram.png';

const SubscribeSuccessPopup: FC<IPopupProps> = ({ isOpen, onClose }) => {

  const btnStyle = {
    width: '100%',
    margin: '20px 0 0 0',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium'>
      <h2 className='popup__title'>Email успешно сохранён</h2>
      <p className='popup__subtitle'>Пришлём уведомление о начале регистрации на Межвузовские транспортные проектные соревнования в 2025 году.</p>
      <div className='popup__author'>
        <img className='popup__author-img popup__author-img_size_small' src={telegramIcon} alt='телеграм'></img>
        <div className='popup__author-info'>
          <p className='popup__author-title'>Ещё больше информации в&nbsp;нашем <Link text='Телеграм-канале' path='https://t.me/contestmiit' /></p>
        </div>
      </div>
      <Button style={btnStyle} text='Хорошо>' onClick={onClose} />
    </Popup>
  );
};

export default SubscribeSuccessPopup;
