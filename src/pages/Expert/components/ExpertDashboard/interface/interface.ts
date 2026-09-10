export interface IParticipant {
  id: number;
  fullname: string;
  educational_organization: string;
  isSubmitted: boolean;
  hasFormProgress: boolean;
  isScored: boolean;
  main_position: string;
  nomination: number | null;
  phone_number: string;
  email: string;
  timezone: string;
  form_name: string;
};

export interface IDashboardStats {
  registrations: number;
  uniqueUniversities: number;
  listeners: number;
  completedTraining: number;
}

export interface IBarItem {
  id: number;
  name: string;
  shortName: string;
  registered: IParticipant[];
  nominationSelected: IParticipant[];
  formSubmitted: IParticipant[];
};

export interface IBarDataWithLabels {
  [key: string]: number | string;
  shortName: string;
  originalName: string;
}

export interface IPieChartDatum {
  id: string;
  label: string;
  value: number;
}

export type TCourseStatusKey =
  | 'filling'
  | 'waiting'
  | 'studying'
  | 'completed'
  | 'expelled';

export interface ICourseUniversityStats {
  id: number;
  name: string;
  shortName: string;
  filling: IParticipant[];
  waiting: IParticipant[];
  studying: IParticipant[];
  completed: IParticipant[];
  expelled: IParticipant[];
}

export interface ICourseDashboardStats {
  cards: Record<TCourseStatusKey, number>;
  byUniversity: ICourseUniversityStats[];
}
