export interface IStagesCardItem {
  id: number;
  date: string;
  title: string;
  text: Array<string>;
  color: 'default' | 'gradient' | 'photo';
  type: 'default' | 'registration';
}

export interface IStagesCardProps {
  card: IStagesCardItem;
}
