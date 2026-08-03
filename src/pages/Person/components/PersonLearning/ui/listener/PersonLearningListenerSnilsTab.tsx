import type { FC, ChangeEvent } from 'react';
import type { IListenerTabProps } from '../../interface/interface';

import { FormInput } from '../../../../../../shared/components/Form/components/FormInput/form-input';

import PersonLearningListenerField from './PersonLearningListenerField';
import PersonLearningListenerFileUpload from './PersonLearningListenerFileUpload';
import PersonLearningListenerFooter from './PersonLearningListenerFooter';
import PersonLearningListenerSectionBanner from './PersonLearningListenerSectionBanner';

import {
  hasListenerFieldError,
  makeListenerFieldError,
} from '../../lib/listenerFieldError';

import '../../styles/listener.css';

const PersonLearningListenerSnilsTab: FC<IListenerTabProps> = ({
  formData,
  fieldErrors,
  isSectionConfirmed,
  isReadOnly,
  onChange,
  onBack,
  onSave,
  onContinue,
  onUploadDocument,
  isSaving,
  isUploading,
}) => {
  const handleSnils = (e: ChangeEvent<HTMLInputElement>) => {
    onChange('snils', e.target.value);
  };

  return (
    <>
      {isSectionConfirmed && <PersonLearningListenerSectionBanner section='snils' />}
      <div className='person-learning-listener'>
        <div className='person-learning-listener__row person-learning-listener__row_full'>
          <PersonLearningListenerField
            title='Номер СНИЛС'
            fieldKey='snils'
            fieldError={makeListenerFieldError(fieldErrors, 'snils')}
          >
            <FormInput
              name='snils'
              value={formData.snils}
              onChange={handleSnils}
              placeholder='000-000-000 00'
              hasError={hasListenerFieldError(fieldErrors, 'snils')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <PersonLearningListenerFileUpload
          label='Загрузите фотографию или скан документа'
          fileName={formData.snilsFileName}
          onUpload={(file) => onUploadDocument?.('snils', file)}
          isUploading={isUploading}
          fieldError={makeListenerFieldError(fieldErrors, 'snilsFileName')}
          fieldKey='snilsFileName'
          disabled={isReadOnly}
        />
      </div>

      <PersonLearningListenerFooter
        variant='middle'
        onBack={onBack}
        onSave={onSave}
        onContinue={onContinue}
        isSaving={isSaving}
        isSectionConfirmed={isSectionConfirmed}
      />
    </>
  );
};

export default PersonLearningListenerSnilsTab;
