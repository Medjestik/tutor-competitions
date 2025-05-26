export interface ICurrentUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  current_stage_id: number;
  educational_organization: string;
  email: string;
  main_position: string;
  phone_number: string;
  role: string;
  telegram_username: string;
  timezone: string;
}


export interface ICase {
  id: string
  icon: string;
  problem: string;
  situation: string;
  title: string;
  telegram_url: string;
  files: IFile[];
  description: string;
}

export interface IFile {
  id: number;
  case: string;
  url: string;
  name: string;
  description?: string;
  position: number;
}

export interface IUniversity {
  id: number;
  name: string;
  short_name?: string
  icon?: string;
  city?: string;
}
