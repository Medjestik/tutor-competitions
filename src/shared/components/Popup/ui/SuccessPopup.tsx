import type { FC } from 'react';
import type { IPopupProps } from '../interface/interface'; 

import icon from '../../../../shared/icons/popup/success.png';

import Popup from './Popup';
import Button from '../../Button/ui/Button';

import '../styles/style.css';

const SuccessPopup: FC<IPopupProps> = ({ isOpen, onClose }) => {

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
      <h2 className='popup__title'>Поздравляем!</h2>
      <p className='popup__subtitle'>Ваша команда отлично справилась со всеми этапами соревнований. Вы проделали большую работу: проанализировали проблему, предложили идеи и создали прототип.</p>
      <p className='popup__subtitle'>Теперь остаётся только немного подождать. В ближайшее время будут объявлены итоги, и вы узнаете, как эксперты оценили ваши решения.</p>
      <p className='popup__subtitle'>Спасибо за ваш труд. Результаты уже совсем скоро!</p>
      <Button style={btnStyle} text='Хорошо' onClick={onClose} />
    </Popup>
  );
};

export default SuccessPopup;
