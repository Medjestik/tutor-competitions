import type { FC, ChangeEvent } from 'react';
import type { IListenerTabProps } from '../../interface/interface';

import { FormInput } from '../../../../../../shared/components/Form/components/FormInput/form-input';

import PersonLearningListenerField from './PersonLearningListenerField';
import PersonLearningListenerDateInputs from './PersonLearningListenerDateInputs';
import PersonLearningListenerCheckbox from './PersonLearningListenerCheckbox';
import PersonLearningListenerFooter from './PersonLearningListenerFooter';
import PersonLearningListenerSectionBanner from './PersonLearningListenerSectionBanner';

import { listenerContent } from '../../mock/listenerContent';
import {
  hasListenerFieldError,
  makeListenerFieldError,
} from '../../lib/listenerFieldError';

import '../../styles/listener.css';

const PersonLearningListenerConsentTab: FC<IListenerTabProps> = ({
  formData,
  fieldErrors,
  isSectionConfirmed,
  isReadOnly,
  onChange,
  onBack,
  onSave,
  onContinue,
  isSaving,
}) => {
  const handleInput =
    (
      key:
        | 'lastName'
        | 'firstName'
        | 'middleName'
        | 'registrationAddress'
        | 'passportSeries'
        | 'passportNumber'
        | 'passportIssuedBy'
        | 'email'
        | 'phone'
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(key, e.target.value);
    };

  return (
    <>
      {isSectionConfirmed && <PersonLearningListenerSectionBanner section='consent' />}
      <div className='person-learning-listener'>
        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Фамилия'
            withInfo
            infoText={listenerContent.autoFillInfoText}
          >
            <FormInput
              name='consentLastName'
              value={formData.lastName}
              onChange={handleInput('lastName')}
              placeholder='Введите фамилию'
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Имя'
            withInfo
            infoText={listenerContent.autoFillInfoText}
          >
            <FormInput
              name='consentFirstName'
              value={formData.firstName}
              onChange={handleInput('firstName')}
              placeholder='Введите имя'
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row person-learning-listener__row_full'>
          <PersonLearningListenerField
            title='Отчество (при наличии)'
            withInfo
            infoText={listenerContent.autoFillInfoText}
          >
            <FormInput
              name='consentMiddleName'
              value={formData.middleName}
              onChange={handleInput('middleName')}
              placeholder='Введите отчество'
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row person-learning-listener__row_full'>
          <PersonLearningListenerField
            title='Адрес постоянной регистрации'
            fieldKey='registrationAddress'
            fieldError={makeListenerFieldError(fieldErrors, 'registrationAddress')}
          >
            <FormInput
              name='registrationAddress'
              value={formData.registrationAddress}
              onChange={handleInput('registrationAddress')}
              placeholder='Введите адрес постоянной регистрации'
              hasError={hasListenerFieldError(fieldErrors, 'registrationAddress')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__passport-row'>
          <div className='person-learning-listener__passport-series'>
            <PersonLearningListenerField
              title='Серия паспорта'
              fieldKey='passportSeries'
              fieldError={makeListenerFieldError(fieldErrors, 'passportSeries')}
            >
              <FormInput
                name='passportSeries'
                value={formData.passportSeries}
                onChange={handleInput('passportSeries')}
                placeholder='0000'
                hasError={hasListenerFieldError(fieldErrors, 'passportSeries')}
                disabled={isReadOnly}
              />
            </PersonLearningListenerField>
          </div>
          <div className='person-learning-listener__passport-number'>
            <PersonLearningListenerField
              title='Номер паспорта'
              fieldKey='passportNumber'
              fieldError={makeListenerFieldError(fieldErrors, 'passportNumber')}
            >
              <FormInput
                name='passportNumber'
                value={formData.passportNumber}
                onChange={handleInput('passportNumber')}
                placeholder='00000000'
                hasError={hasListenerFieldError(fieldErrors, 'passportNumber')}
                disabled={isReadOnly}
              />
            </PersonLearningListenerField>
          </div>
          <div className='person-learning-listener__passport-date'>
            <PersonLearningListenerField
              title='Дата выдачи паспорта'
              fieldKey='passportIssueDate'
              fieldError={makeListenerFieldError(fieldErrors, 'passportIssueDate')}
            >
              <PersonLearningListenerDateInputs
                value={formData.passportIssueDate}
                onChange={(value) => onChange('passportIssueDate', value)}
                hasError={hasListenerFieldError(fieldErrors, 'passportIssueDate')}
                disabled={isReadOnly}
              />
            </PersonLearningListenerField>
          </div>
        </div>

        <div className='person-learning-listener__row person-learning-listener__row_full'>
          <PersonLearningListenerField
            title='Кем выдан паспорт'
            fieldKey='passportIssuedBy'
            fieldError={makeListenerFieldError(fieldErrors, 'passportIssuedBy')}
          >
            <FormInput
              name='passportIssuedBy'
              value={formData.passportIssuedBy}
              onChange={handleInput('passportIssuedBy')}
              placeholder='Введите наименование органа, выдавшего документ'
              hasError={hasListenerFieldError(fieldErrors, 'passportIssuedBy')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Электронная почта'
            withInfo
            infoText={listenerContent.autoFillInfoText}
          >
            <FormInput
              name='consentEmail'
              value={formData.email}
              onChange={handleInput('email')}
              placeholder='Введите электронную почту'
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Номер телефона'
            withInfo
            infoText={listenerContent.autoFillInfoText}
          >
            <FormInput
              name='consentPhone'
              value={formData.phone}
              onChange={handleInput('phone')}
              placeholder='Введите номер телефона'
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <PersonLearningListenerCheckbox
          checked={formData.personalDataConsent}
          onChange={(checked) => onChange('personalDataConsent', checked)}
          hasError={hasListenerFieldError(fieldErrors, 'personalDataConsent')}
          errorText={fieldErrors.personalDataConsent}
          fieldKey='personalDataConsent'
          disabled={isReadOnly}
        >
          Выражаю{' '}
          <span className='person-learning-listener__consent-link'>
            согласие на обработку персональных данных
          </span>
        </PersonLearningListenerCheckbox>
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

export default PersonLearningListenerConsentTab;
