import type {
  IListenerDateParts,
  IListenerFormState,
  TListenerFieldErrors,
  TListenerTab,
} from '../interface/interface';

import {
  emailFormat,
  phoneFormat,
  required,
  selectRequired,
} from '../../../../../shared/lib/validationRules';

interface IValidationRule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (value: any) => boolean;
  errorMessage: string;
}

const runRules = (value: unknown, rules: IValidationRule[]): string | undefined => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.errorMessage;
    }
  }
  return undefined;
};

const datePartsRequired = (
  errorMessage = 'Укажите полную дату'
) => ({
  validate: (value: unknown) => {
    if (!value || typeof value !== 'object') return false;
    const parts = value as IListenerDateParts;
    const day = String(parts.day || '').trim();
    const month = String(parts.month || '').trim();
    const year = String(parts.year || '').trim();
    if (!day || !month || !year) return false;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (!Number.isInteger(dayNum) || !Number.isInteger(monthNum) || !Number.isInteger(yearNum)) {
      return false;
    }
    const date = new Date(yearNum, monthNum - 1, dayNum);
    return (
      date.getFullYear() === yearNum &&
      date.getMonth() === monthNum - 1 &&
      date.getDate() === dayNum
    );
  },
  errorMessage,
});

const genderRequired = (
  errorMessage = 'Выберите пол'
) => ({
  validate: (value: unknown) => value === 'female' || value === 'male',
  errorMessage,
});

const graduationYearValid = (
  errorMessage = 'Укажите корректный год окончания обучения'
) => ({
  validate: (value: unknown) => {
    const year = Number(String(value || '').trim());
    if (!Number.isInteger(year)) return false;
    const currentYear = new Date().getFullYear();
    return year >= 1950 && year <= currentYear;
  },
  errorMessage,
});

const passportSeriesFormat = (
  errorMessage = 'Серия паспорта должна содержать 4 цифры'
) => ({
  validate: (value: unknown) => /^\d{4}$/.test(String(value || '').trim()),
  errorMessage,
});

const passportNumberFormat = (
  errorMessage = 'Номер паспорта должен содержать 6 цифр'
) => ({
  validate: (value: unknown) => /^\d{6}$/.test(String(value || '').trim()),
  errorMessage,
});

const snilsFormat = (
  errorMessage = 'СНИЛС должен содержать 11 цифр'
) => ({
  validate: (value: unknown) => {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length === 11;
  },
  errorMessage,
});

const fileRequired = (
  errorMessage = 'Загрузите документ'
) => ({
  validate: (value: unknown) => String(value || '').trim().length > 0,
  errorMessage,
});

const consentRequired = (
  errorMessage = 'Необходимо дать согласие на обработку персональных данных'
) => ({
  validate: (value: unknown) => value === true,
  errorMessage,
});

const INFO_FIELDS: Array<{
  key: keyof IListenerFormState;
  rules: IValidationRule[];
}> = [
  { key: 'lastName', rules: [required()] },
  { key: 'firstName', rules: [required()] },
  { key: 'birthDate', rules: [datePartsRequired()] },
  { key: 'gender', rules: [genderRequired()] },
  { key: 'educationLevelId', rules: [selectRequired('Выберите уровень образования')] },
  { key: 'graduationYear', rules: [required(), graduationYearValid()] },
  { key: 'institutionName', rules: [required()] },
  { key: 'actualAddress', rules: [required()] },
  { key: 'studyAddress', rules: [required()] },
  { key: 'workplace', rules: [required()] },
  { key: 'position', rules: [required()] },
  { key: 'email', rules: [required(), emailFormat()] },
  { key: 'phone', rules: [required(), phoneFormat()] },
];

const CONSENT_FIELDS: Array<{
  key: keyof IListenerFormState;
  rules: IValidationRule[];
}> = [
  { key: 'registrationAddress', rules: [required()] },
  { key: 'passportSeries', rules: [required(), passportSeriesFormat()] },
  { key: 'passportNumber', rules: [required(), passportNumberFormat()] },
  { key: 'passportIssueDate', rules: [datePartsRequired('Укажите дату выдачи паспорта')] },
  { key: 'passportIssuedBy', rules: [required()] },
  { key: 'personalDataConsent', rules: [consentRequired()] },
];

const SNILS_FIELDS: Array<{
  key: keyof IListenerFormState;
  rules: IValidationRule[];
}> = [
  { key: 'snils', rules: [required(), snilsFormat()] },
  { key: 'snilsFileName', rules: [fileRequired('Загрузите фотографию или скан документа')] },
];

const DIPLOMA_FIELDS: Array<{
  key: keyof IListenerFormState;
  rules: IValidationRule[];
}> = [
  {
    key: 'diplomaFileName',
    rules: [fileRequired('Загрузите скан или фотографию диплома об образовании')],
  },
];

const SECTION_FIELDS: Record<TListenerTab, Array<{
  key: keyof IListenerFormState;
  rules: IValidationRule[];
}>> = {
  info: INFO_FIELDS,
  consent: CONSENT_FIELDS,
  snils: SNILS_FIELDS,
  diploma: DIPLOMA_FIELDS,
  review: [],
};

export const validateListenerSection = (
  section: TListenerTab,
  formData: IListenerFormState
): TListenerFieldErrors => {
  const errors: TListenerFieldErrors = {};

  for (const field of SECTION_FIELDS[section]) {
    const error = runRules(formData[field.key], field.rules);
    if (error) {
      errors[field.key] = error;
    }
  }

  return errors;
};

export const hasListenerFieldErrors = (errors: TListenerFieldErrors): boolean =>
  Object.keys(errors).length > 0;

export const getFirstListenerFieldErrorKey = (
  section: TListenerTab,
  errors: TListenerFieldErrors
): keyof IListenerFormState | undefined => {
  const fields = SECTION_FIELDS[section];
  for (const field of fields) {
    if (errors[field.key]) {
      return field.key;
    }
  }
  return undefined;
};

export const getListenerFieldNameAttribute = (
  key: keyof IListenerFormState
): string => {
  const nameMap: Partial<Record<keyof IListenerFormState, string>> = {
    lastName: 'lastName',
    firstName: 'firstName',
    middleName: 'middleName',
    birthDate: 'birthDate',
    gender: 'gender',
    educationLevelId: 'educationLevelId',
    graduationYear: 'graduationYear',
    institutionName: 'institutionName',
    actualAddress: 'actualAddress',
    studyAddress: 'studyAddress',
    workplace: 'workplace',
    position: 'position',
    email: 'email',
    phone: 'phone',
    registrationAddress: 'registrationAddress',
    passportSeries: 'passportSeries',
    passportNumber: 'passportNumber',
    passportIssueDate: 'passportIssueDate',
    passportIssuedBy: 'passportIssuedBy',
    personalDataConsent: 'personalDataConsent',
    snils: 'snils',
    snilsFileName: 'snilsFileName',
    diplomaFileName: 'diplomaFileName',
  };

  return nameMap[key] || String(key);
};
