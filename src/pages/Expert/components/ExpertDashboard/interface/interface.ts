export interface IParticipant {
  id: number;
  fullname: string;
  educational_organization: string;
  isSubmitted: boolean;
  isScored: boolean;
  main_position: string;
  nomination: number;
  phone_number: string;
  email: string;
  timezone: string;
  form_name: string;
};

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
