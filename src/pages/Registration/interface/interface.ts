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

interface IParticipantData {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  group_name: string;
  level: number;
  telegram_url?: string;
}

export interface IRegisterData {
  name: string;
  login: string;
  university: number;
  case: string;
  participants: IParticipantData[];
}
