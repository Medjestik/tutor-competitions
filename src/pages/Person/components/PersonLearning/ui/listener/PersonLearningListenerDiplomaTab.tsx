import type { FC } from 'react';
import type { IListenerTabProps } from '../../interface/interface';

import PersonLearningListenerFileUpload from './PersonLearningListenerFileUpload';
import PersonLearningListenerFooter from './PersonLearningListenerFooter';
import PersonLearningListenerSectionBanner from './PersonLearningListenerSectionBanner';

import { listenerContent } from '../../mock/listenerContent';
import { makeListenerFieldError } from '../../lib/listenerFieldError';

import '../../styles/listener.css';

const PersonLearningListenerDiplomaTab: FC<IListenerTabProps> = ({
  formData,
  fieldErrors,
  isSectionConfirmed,
  isReadOnly,
  onBack,
  onSave,
  onContinue,
  onUploadDocument,
  isSaving,
  isUploading,
}) => {
  return (
    <>
      {isSectionConfirmed && <PersonLearningListenerSectionBanner section='diploma' />}
      <div className='person-learning-listener'>
        <PersonLearningListenerFileUpload
          label='Скан или фотография диплома об образовании'
          fileName={formData.diplomaFileName}
          onUpload={(file) => onUploadDocument?.('diploma', file)}
          isUploading={isUploading}
          fieldError={makeListenerFieldError(fieldErrors, 'diplomaFileName')}
          fieldKey='diplomaFileName'
          disabled={isReadOnly}
        />
        <PersonLearningListenerFileUpload
          label='Скан или фотография свидетельства о браке или перемене имени'
          withInfo
          infoText={listenerContent.marriageCertInfoText}
          fileName={formData.marriageCertFileName}
          onUpload={(file) => onUploadDocument?.('marriage_cert', file)}
          isUploading={isUploading}
          disabled={isReadOnly}
        />
        <PersonLearningListenerFileUpload
          label='Скан или фотография апостиля диплома об образовании'
          withInfo
          infoText={listenerContent.apostilleInfoText}
          fileName={formData.apostilleFileName}
          onUpload={(file) => onUploadDocument?.('apostille', file)}
          isUploading={isUploading}
          disabled={isReadOnly}
        />
        <PersonLearningListenerFileUpload
          label='Скан или фотография диплома о присуждении учёной степени (при наличии)'
          fileName={formData.degreeDiplomaFileName}
          onUpload={(file) => onUploadDocument?.('degree_diploma', file)}
          isUploading={isUploading}
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

export default PersonLearningListenerDiplomaTab;
