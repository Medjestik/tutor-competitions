import type { FC, CSSProperties } from 'react';
import type { IPersonLearningListenerFooterProps } from '../../interface/interface';

import Button from '../../../../../../shared/components/Button/ui/Button';

import '../../styles/listener.css';

const backBtnStyle: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '96px',
  padding: '16px 24px',
  lineHeight: 1,
  background: '#f4f8ff',
  border: 'none',
};

const saveBtnStyle: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '131px',
  padding: '16px 24px',
  lineHeight: 1,
};

const continueBtnStyle: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '240px',
  padding: '16px 24px',
  lineHeight: 1,
};

const submitBtnStyle: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '215px',
  padding: '16px 24px',
  lineHeight: 1,
};

const PersonLearningListenerFooter: FC<IPersonLearningListenerFooterProps> = ({
  variant,
  onBack,
  onSave,
  onContinue,
  onSubmit,
  isSaving = false,
  isSectionConfirmed = false,
  isSubmitDisabled = false,
}) => {
  const saveText = isSaving ? 'Сохранение...' : 'Сохранить';
  const continueText = isSaving ? 'Сохранение...' : 'Подтвердить и продолжить';

  if (isSectionConfirmed) {
    if (variant === 'info') {
      return null;
    }

    if (variant === 'submit') {
      return (
        <div className='person-learning__footer person-learning__footer_split'>
          <Button text='Назад' color='primary' onClick={onBack} style={backBtnStyle} />
        </div>
      );
    }

    return (
      <div className='person-learning__footer person-learning__footer_split'>
        <Button text='Назад' color='primary' onClick={onBack} style={backBtnStyle} />
      </div>
    );
  }

  if (variant === 'review') {
    return (
      <div className='person-learning__footer person-learning__footer_split'>
        <Button text='Назад' color='primary' onClick={onBack} style={backBtnStyle} />
        <Button
          text={isSaving ? 'Отправка...' : 'Отправить документы на проверку'}
          color='gradient'
          onClick={onSubmit}
          style={submitBtnStyle}
          disabled={isSubmitDisabled || isSaving}
        />
      </div>
    );
  }

  if (variant === 'submit') {
    return (
      <div className='person-learning__footer person-learning__footer_split'>
        <Button text='Назад' color='primary' onClick={onBack} style={backBtnStyle} />
        <Button
          text={isSaving ? 'Сохранение...' : 'Отправить документы'}
          color='gradient'
          onClick={onSubmit}
          style={submitBtnStyle}
        />
      </div>
    );
  }

  if (variant === 'info') {
    return (
      <div className='person-learning__footer'>
        <Button text={saveText} color='gradient' onClick={onSave} style={saveBtnStyle} />
        <Button
          text={continueText}
          color='primary'
          onClick={onContinue}
          style={continueBtnStyle}
        />
      </div>
    );
  }

  return (
    <div className='person-learning__footer person-learning__footer_split'>
      <Button text='Назад' color='primary' onClick={onBack} style={backBtnStyle} />
      <div className='person-learning__footer-actions'>
        <Button text={saveText} color='gradient' onClick={onSave} style={saveBtnStyle} />
        <Button
          text={continueText}
          color='primary'
          onClick={onContinue}
          style={continueBtnStyle}
        />
      </div>
    </div>
  );
};

export default PersonLearningListenerFooter;
