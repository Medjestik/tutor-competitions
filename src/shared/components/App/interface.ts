export interface ICurrentTeam {
  id: number;
  name: string;
  university: IUniversity | null;
  case: ICase | null;
  current_stage: number;
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
