import type { IRegistrationFormValues } from '../interface/interface';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import {
  required,
  minLength,
  maxLength,
  emailFormat,
  phoneFormat,
} from '../../../shared/lib/validationRules';

import { OTHER_ORGANIZATION } from './organizations';

export const initialRegistrationValues: IRegistrationFormValues = {
  last_name: '',
  first_name: '',
  middle_name: '',
  phone_number: '+7',
  email: '',
  educational_organization: '',
  other_organization: '',
  main_position: '',
  username: '',
  password: '',
  consent_personal_data: false,
  consent_personal_data_policy: false,
  consent_personal_data_spread: false,
  consent_competition_rules: false,
};

export const validationSchema = {
  last_name: [
    required('Поле обязательно'),
    minLength(2, 'Минимум 2 символа'),
    maxLength(150, 'Максимум 150 символов'),
  ],
  first_name: [
    required('Поле обязательно'),
    minLength(2, 'Минимум 2 символа'),
    maxLength(150, 'Максимум 150 символов'),
  ],
  middle_name: [maxLength(150, 'Максимум 150 символов')],
  phone_number: [required('Поле обязательно'), phoneFormat()],
  email: [required('Поле обязательно'), emailFormat()],
  other_organization: [
    required('Поле обязательно'),
    minLength(2, 'Минимум 2 символа'),
    maxLength(255, 'Максимум 255 символов'),
  ],
  main_position: [
    required('Поле обязательно'),
    minLength(2, 'Минимум 2 символа'),
    maxLength(255, 'Максимум 255 символов'),
  ],
  username: [
    required('Поле обязательно'),
    minLength(6, 'Минимум 6 символов'),
    maxLength(16, 'Максимум 16 символов'),
  ],
  password: [
    required('Поле обязательно'),
    minLength(8, 'Пароль должен содержать минимум 8 символов'),
    maxLength(128, 'Максимум 128 символов'),
  ],
};

const hasFieldError = (
  errors: TFormValidationErrors,
  field: keyof IRegistrationFormValues
): boolean => Boolean(errors[field]);

export const isPersonalStepValid = (
  values: IRegistrationFormValues,
  errors: TFormValidationErrors
): boolean =>
  Boolean(values.last_name.trim()) &&
  !hasFieldError(errors, 'last_name') &&
  Boolean(values.first_name.trim()) &&
  !hasFieldError(errors, 'first_name') &&
  !hasFieldError(errors, 'middle_name') &&
  Boolean(values.phone_number.trim()) &&
  !hasFieldError(errors, 'phone_number') &&
  Boolean(values.email.trim()) &&
  !hasFieldError(errors, 'email');

export const isProfessionalStepValid = (
  values: IRegistrationFormValues,
  errors: TFormValidationErrors
): boolean => {
  const isOther = values.educational_organization === OTHER_ORGANIZATION.name;
  const organizationOk = isOther
    ? Boolean(values.other_organization.trim()) &&
      !hasFieldError(errors, 'other_organization')
    : Boolean(values.educational_organization.trim());

  return (
    organizationOk &&
    Boolean(values.main_position.trim()) &&
    !hasFieldError(errors, 'main_position')
  );
};

export const isAccountStepValid = (
  values: IRegistrationFormValues,
  errors: TFormValidationErrors
): boolean =>
  Boolean(values.username.trim()) &&
  !hasFieldError(errors, 'username') &&
  Boolean(values.password.trim()) &&
  !hasFieldError(errors, 'password');

export const isConfirmationStepValid = (
  values: IRegistrationFormValues
): boolean =>
  values.consent_personal_data &&
  values.consent_personal_data_policy &&
  values.consent_personal_data_spread &&
  values.consent_competition_rules;

export const resolveOrganizationName = (
  values: IRegistrationFormValues
): string => {
  if (values.educational_organization === OTHER_ORGANIZATION.name) {
    return values.other_organization.trim();
  }
  return values.educational_organization.trim();
};

export const getTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};
