export interface ICasesCardItem {
  id: string;
  situation: string;
  problem: string;
  title: string;
  icon: string;
}

export interface ICasesCardProps {
  card: ICasesCardItem;
}
