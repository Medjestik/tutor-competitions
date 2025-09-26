export interface ITimeInterval {
  start: string;
  end: string;
  status: 'free' | 'busy' | string;
}

export interface ITimeSelectProps {
  intervals: ITimeInterval[];
  selected: ITimeInterval[];
  onChange?: (selected: ITimeInterval[]) => void;
}
