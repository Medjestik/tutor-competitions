import type { FC, FormEvent } from 'react';
import type { IConfirmRemovePopupProps } from '../interface/interface';

import Popup from './Popup';
import Form from '../../Form/ui/Form';
import Button from '../../Button/ui/Button';
import FormSubmit from '../../Form/components/FormSubmit/ui/FormSubmit';

import '../styles/style.css';

const ConfirmRemovePopup: FC<IConfirmRemovePopupProps> = ({ isOpen, onClose, onRemove }) => {

  const btnStyle = {
    width: '100%',
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
      <Form formName='add-participant' type='popup' onSubmit={handleSubmit}>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Отменить' color='cancel' onClick={onClose} />
          <FormSubmit text='Удалить' />
        </div>
      </Form>
    </Popup>
  );
};

export default ConfirmRemovePopup;
