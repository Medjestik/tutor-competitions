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
