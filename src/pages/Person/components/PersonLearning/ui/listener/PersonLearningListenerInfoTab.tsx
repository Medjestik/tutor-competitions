import type { FC, ChangeEvent } from 'react';
import type { IListenerTabProps } from '../../interface/interface';
import type { ISelectOption } from '../../../../../../shared/components/Select/interface/interface';

import { FormInput } from '../../../../../../shared/components/Form/components/FormInput/form-input';
import SelectWithSearch from '../../../../../../shared/components/Select/ui/SelectWithSearch';

import PersonLearningListenerField from './PersonLearningListenerField';
import PersonLearningListenerGenderToggle from './PersonLearningListenerGenderToggle';
import PersonLearningListenerDateInputs from './PersonLearningListenerDateInputs';
import PersonLearningListenerCheckbox from './PersonLearningListenerCheckbox';
import PersonLearningListenerFooter from './PersonLearningListenerFooter';
import PersonLearningListenerSectionBanner from './PersonLearningListenerSectionBanner';

import {
  listenerContent,
  educationLevelOptions,
} from '../../mock/listenerContent';
import {
  hasListenerFieldError,
  makeListenerFieldError,
} from '../../lib/listenerFieldError';

import '../../styles/listener.css';

const PersonLearningListenerInfoTab: FC<IListenerTabProps> = ({
  formData,
  fieldErrors,
  isSectionConfirmed,
  isReadOnly,
  onChange,
  onSave,
  onContinue,
  isSaving,
}) => {
  const handleInput =
    (key: 'lastName' | 'firstName' | 'middleName' | 'graduationYear' | 'institutionName' | 'actualAddress' | 'studyAddress' | 'workplace' | 'position' | 'email' | 'phone') =>
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(key, e.target.value);
    };

  const educationOption =
    educationLevelOptions.find((o) => o.id === formData.educationLevelId) ||
    educationLevelOptions[0];

  const handleAddressSame = (checked: boolean) => {
    onChange('addressSameAsActual', checked);
    if (checked) {
      onChange('studyAddress', formData.actualAddress);
    }
  };

  const handleActualAddress = (e: ChangeEvent<HTMLInputElement>) => {
    onChange('actualAddress', e.target.value);
    if (formData.addressSameAsActual) {
      onChange('studyAddress', e.target.value);
    }
  };

  return (
    <>
      {isSectionConfirmed && <PersonLearningListenerSectionBanner section='info' />}
      <div className='person-learning-listener'>
        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Фамилия'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='lastName'
            fieldError={makeListenerFieldError(fieldErrors, 'lastName')}
          >
            <FormInput
              name='lastName'
              value={formData.lastName}
              onChange={handleInput('lastName')}
              placeholder='Введите фамилию'
              hasError={hasListenerFieldError(fieldErrors, 'lastName')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Имя'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='firstName'
            fieldError={makeListenerFieldError(fieldErrors, 'firstName')}
          >
            <FormInput
              name='firstName'
              value={formData.firstName}
              onChange={handleInput('firstName')}
              placeholder='Введите имя'
              hasError={hasListenerFieldError(fieldErrors, 'firstName')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Отчество (при наличии)'
            withInfo
            infoText={listenerContent.autoFillInfoText}
          >
            <FormInput
              name='middleName'
              value={formData.middleName}
              onChange={handleInput('middleName')}
              placeholder='Введите отчество'
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <div className='person-learning-listener__row_birth'>
            <div className='person-learning-listener__birth-block'>
              <PersonLearningListenerField
                title='Дата рождения'
                fieldKey='birthDate'
                fieldError={makeListenerFieldError(fieldErrors, 'birthDate')}
              >
                <PersonLearningListenerDateInputs
                  value={formData.birthDate}
                  onChange={(value) => onChange('birthDate', value)}
                  hasError={hasListenerFieldError(fieldErrors, 'birthDate')}
                  disabled={isReadOnly}
                />
              </PersonLearningListenerField>
            </div>
            <div className='person-learning-listener__gender-block'>
              <PersonLearningListenerField
                title='Пол'
                fieldKey='gender'
                fieldError={makeListenerFieldError(fieldErrors, 'gender')}
              >
                <PersonLearningListenerGenderToggle
                  value={formData.gender}
                  onChange={(value) => onChange('gender', value)}
                  hasError={hasListenerFieldError(fieldErrors, 'gender')}
                  disabled={isReadOnly}
                />
              </PersonLearningListenerField>
            </div>
          </div>
        </div>

        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Уровень образования'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='educationLevelId'
            fieldError={makeListenerFieldError(fieldErrors, 'educationLevelId')}
          >
            <SelectWithSearch
              options={educationLevelOptions}
              currentOption={educationOption}
              onChooseOption={(option: ISelectOption) =>
                onChange('educationLevelId', option.id)
              }
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Год окончания обучения'
            fieldKey='graduationYear'
            fieldError={makeListenerFieldError(fieldErrors, 'graduationYear')}
          >
            <FormInput
              type='number'
              min={1}
              name='graduationYear'
              value={formData.graduationYear}
              onChange={handleInput('graduationYear')}
              placeholder='Например, 2010'
              hasError={hasListenerFieldError(fieldErrors, 'graduationYear')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row person-learning-listener__row_full'>
          <PersonLearningListenerField
            title='Наименование образовательного учреждения'
            fieldKey='institutionName'
            fieldError={makeListenerFieldError(fieldErrors, 'institutionName')}
          >
            <FormInput
              name='institutionName'
              value={formData.institutionName}
              onChange={handleInput('institutionName')}
              placeholder='Введите название учреждения'
              hasError={hasListenerFieldError(fieldErrors, 'institutionName')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Адрес фактического проживания'
            fieldKey='actualAddress'
            fieldError={makeListenerFieldError(fieldErrors, 'actualAddress')}
          >
            <FormInput
              name='actualAddress'
              value={formData.actualAddress}
              onChange={handleActualAddress}
              placeholder='Введите адрес'
              hasError={hasListenerFieldError(fieldErrors, 'actualAddress')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Адрес проживания в период обучения'
            fieldKey='studyAddress'
            fieldError={makeListenerFieldError(fieldErrors, 'studyAddress')}
          >
            <FormInput
              name='studyAddress'
              value={formData.studyAddress}
              onChange={handleInput('studyAddress')}
              placeholder='Введите адрес проживания в период обучения'
              disabled={formData.addressSameAsActual || isReadOnly}
              hasError={hasListenerFieldError(fieldErrors, 'studyAddress')}
            />
          </PersonLearningListenerField>
        </div>

        <PersonLearningListenerCheckbox
          checked={formData.addressSameAsActual}
          onChange={handleAddressSame}
          disabled={isReadOnly}
        >
          Совпадает с фактическим адресом
        </PersonLearningListenerCheckbox>

        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Место работы'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='workplace'
            fieldError={makeListenerFieldError(fieldErrors, 'workplace')}
          >
            <FormInput
              name='workplace'
              value={formData.workplace}
              onChange={handleInput('workplace')}
              placeholder='Введите место работы'
              hasError={hasListenerFieldError(fieldErrors, 'workplace')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Занимаемая должность'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='position'
            fieldError={makeListenerFieldError(fieldErrors, 'position')}
          >
            <FormInput
              name='position'
              value={formData.position}
              onChange={handleInput('position')}
              placeholder='Введите должность'
              hasError={hasListenerFieldError(fieldErrors, 'position')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>

        <div className='person-learning-listener__row'>
          <PersonLearningListenerField
            title='Электронная почта'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='email'
            fieldError={makeListenerFieldError(fieldErrors, 'email')}
          >
            <FormInput
              name='email'
              value={formData.email}
              onChange={handleInput('email')}
              placeholder='Введите электронную почту'
              hasError={hasListenerFieldError(fieldErrors, 'email')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
          <PersonLearningListenerField
            title='Номер телефона'
            withInfo
            infoText={listenerContent.autoFillInfoText}
            fieldKey='phone'
            fieldError={makeListenerFieldError(fieldErrors, 'phone')}
          >
            <FormInput
              name='phone'
              value={formData.phone}
              onChange={handleInput('phone')}
              placeholder='Введите номер телефона'
              hasError={hasListenerFieldError(fieldErrors, 'phone')}
              disabled={isReadOnly}
            />
          </PersonLearningListenerField>
        </div>
      </div>

      <PersonLearningListenerFooter
        variant='info'
        onSave={onSave}
        onContinue={onContinue}
        isSaving={isSaving}
        isSectionConfirmed={isSectionConfirmed}
      />
    </>
  );
};

export default PersonLearningListenerInfoTab;
