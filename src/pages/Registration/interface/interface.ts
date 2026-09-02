export interface IUniversity {
  id: number;
  name: string;
  short_name?: string;
  city?: string;
  icon?: string;
}

export interface ICourse {
  id: number;
  name: string;
}

export interface IRegisterData {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  telegram_username: string;
  username: string;
  password: string;
  educational_organization: string;
  main_position: string;
  timezone: string;
}

export interface IRegistrationFormValues {
  last_name: string;
  first_name: string;
  middle_name: string;
  phone_number: string;
  email: string;
  educational_organization: string;
  other_organization: string;
  main_position: string;
  username: string;
  password: string;
  consent_personal_data: boolean;
  consent_personal_data_policy: boolean;
  consent_personal_data_spread: boolean;
  consent_competition_rules: boolean;
}

export type TRegistrationStep = 0 | 1 | 2 | 3 | 4;
