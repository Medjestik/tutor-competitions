import type { FC } from 'react';
import type { ICaseDetailProps } from '../interface/interface';

import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const closedId = '6100eede-a79a-40be-a695-5aec7004b6f5';

const CaseDetailPopup: FC<ICaseDetailProps> = ({ isOpen, onClose, currentCase }) => {

  const btnStyle = {
    width: '100%',
    margin: '20px 0 0 0',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium' closeOutside>
      <img className='cases__card-icon' src={currentCase.icon} alt='иконка'></img>
      <h4 className='cases__card-title'>Ситуация</h4>
      <p className='cases__card-text'>{currentCase.situation}</p>
      <h4 className='cases__card-title cases__card-title_type_problem'>Сбой</h4>
      <p className='cases__card-text'>{currentCase.problem}</p>
      {
        currentCase.id === closedId &&
        <p className='cases__card-text cases__card-text-warning'>Регистрация на кейс завершена!</p>
      }
      <Button style={btnStyle} text='Назад' onClick={onClose} />
    </Popup>
  );
};

export default CaseDetailPopup;
