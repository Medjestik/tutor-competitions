import type { FC, ChangeEvent, FormEvent } from 'react';
import type { IPersonLearningListenerConfirmModalProps } from '../../interface/interface';

import { useEffect, useState } from 'react';

import Popup from '../../../../../../shared/components/Popup/ui/Popup';
import Button from '../../../../../../shared/components/Button/ui/Button';
import { FormInput } from '../../../../../../shared/components/Form/components/FormInput/form-input';

import PersonLearningListenerCheckbox from './PersonLearningListenerCheckbox';
import PersonLearningListenerField from './PersonLearningListenerField';

import { confirmModalContent, listenerContent } from '../../mock/listenerContent';

import '../../styles/listener.css';

const cancelBtnStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '120px',
  padding: '16px 24px',
  lineHeight: 1,
  background: '#f4f8ff',
  border: 'none',
};

const confirmBtnStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '140px',
  padding: '16px 24px',
  lineHeight: 1,
};

const PersonLearningListenerConfirmModal: FC<IPersonLearningListenerConfirmModalProps> = ({
  isOpen,
  section,
  isLoading,
  error,
  onClose,
  onConfirm,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAgreed(false);
      setPassword('');
    }
  }, [isOpen, section]);

  const content = confirmModalContent[section];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed || !password.trim() || isLoading) return;
    onConfirm(password);
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium' closeOutside={!isLoading}>
      <h2 className='popup__title'>{content.title}</h2>
      <form className='person-learning-confirm-modal' onSubmit={handleSubmit}>
        <PersonLearningListenerCheckbox checked={agreed} onChange={setAgreed}>
          {content.question}
        </PersonLearningListenerCheckbox>

        <PersonLearningListenerField
          title='Пароль от личного кабинета'
          titleColor='primary'
          caption={listenerContent.passwordCaption}
          className='person-learning-listener-field_password'
        >
          <FormInput
            type='password'
            name='confirmPassword'
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder='Введите пароль'
          />
        </PersonLearningListenerField>

        {error && <p className='person-learning-confirm-modal__error'>{error}</p>}

        <div className='person-learning-confirm-modal__actions'>
          <Button
            text='Отменить'
            color='primary'
            onClick={onClose}
            style={cancelBtnStyle}
          />
          <Button
            text={isLoading ? 'Подтверждение...' : 'Подтвердить'}
            color='gradient'
            type='submit'
            style={confirmBtnStyle}
          />
        </div>
      </form>
    </Popup>
  );
};

export default PersonLearningListenerConfirmModal;
