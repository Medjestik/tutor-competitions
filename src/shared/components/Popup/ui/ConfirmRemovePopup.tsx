/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC, FormEvent } from 'react';
import type { IConfirmRemovePopupProps } from '../interface/interface';

import Popup from './Popup';

import '../styles/style.css';

const ConfirmRemovePopup: FC<IConfirmRemovePopupProps> = ({ isOpen, onClose, onRemove }) => {

  const btnStyle = {
    width: '100%',
    height: '40px',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRemove();
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium' closeOutside>
      <h2 className='popup__title'>Подтверждение удаления</h2>
      <p className='popup__subtitle'>Вы действительно хотите отправить запрос на удаление?</p>
      {
        /*

      <Form formName='add-participant' type='popup' onSubmit={handleSubmit}>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Отменить' color='default' onClick={onClose} />
          <FormSubmit text='Удалить' />
        </div>
      </Form>
      */
      }
    </Popup>
  );
};

export default ConfirmRemovePopup;
