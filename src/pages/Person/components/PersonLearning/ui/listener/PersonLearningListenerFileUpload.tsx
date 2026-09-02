import type { FC, ChangeEvent, RefObject } from 'react';
import type { IPersonLearningListenerFileUploadProps } from '../../interface/interface';

import { useRef } from 'react';

import Button from '../../../../../../shared/components/Button/ui/Button';
import { Tooltip } from '../../../../../../shared/components/Tooltip/ui/tooltip';

import { getListenerFieldNameAttribute } from '../../lib/listenerValidation';

const uploadBtnStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '123px',
  padding: '16px 24px',
  lineHeight: 1,
};

const PersonLearningListenerFileUpload: FC<IPersonLearningListenerFileUploadProps> = ({
  label,
  withInfo = false,
  infoText = '',
  fileName,
  onUpload,
  isUploading = false,
  fieldError,
  fieldKey,
  disabled = false,
  accept = 'image/*,.pdf',
}) => {
  const inputRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>;
  const hasError = Boolean(fieldError?.isShow && fieldError.text);
  const isDisabled = disabled || isUploading;

  const openFileDialog = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div
      className={`person-learning-listener-file${hasError ? ' person-learning-listener-file_has-error' : ''}${isDisabled ? ' person-learning-listener-file_disabled' : ''}`}
      data-listener-field={fieldKey ? getListenerFieldNameAttribute(fieldKey) : undefined}
    >
      <div className='person-learning-listener-field__header'>
        <p className='person-learning-listener-field__title person-learning-listener-field__title_primary'>
          {label}
        </p>
        {withInfo && infoText && (
          <Tooltip
            content={
              <p className='person-learning-listener-field__tooltip-text'>{infoText}</p>
            }
          >
            <div className='person-learning-listener-field__info' />
          </Tooltip>
        )}
      </div>
      <div className='person-learning-listener-file__row'>
        <div
          className='person-learning-listener-file__input-wrap'
          onClick={openFileDialog}
        >
          <input
            ref={inputRef}
            type='file'
            accept={accept}
            onChange={handleFileChange}
            disabled={isDisabled}
          />
          <p className='person-learning-listener-file__name'>
            {fileName || 'Загрузите документ'}
          </p>
        </div>
        <div className='person-learning-listener-file__btn'>
          <Button
            text={isUploading ? 'Загрузка...' : 'Загрузить'}
            color='primary'
            onClick={openFileDialog}
            style={uploadBtnStyle}
          />
        </div>
      </div>
      {hasError && (
        <p className='person-learning-listener-file__error'>{fieldError?.text}</p>
      )}
    </div>
  );
};

export default PersonLearningListenerFileUpload;
