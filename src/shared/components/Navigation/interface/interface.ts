export interface INavigationLink {
  id: string;
  name: string;
  offset: number;
  duration: number;
}

export interface INavigationProps {
  links: INavigationLink[];
  color: 'default' | 'white';
  direction?: 'row'| 'column';
  onClick?: () => void;
}

export enum ENAV {
  DESCRIPTION = 'description',
  STAGES = 'stages',
  RECRUITMENT = 'recruitment',
  ADVANTAGES = 'advantages',
  NOMINATIONS = 'nominations',
  FAQ = 'faq',
  DOCUMENT = 'document',
  LEADERBOARD = 'leaderboard',
  PRIZE = 'prize',
}

export const NavHeaderLinks: INavigationLink[] = [
  { id: ENAV.DESCRIPTION, name: 'О конкурсе', offset: -20, duration: 500 },
  { id: ENAV.RECRUITMENT, name: 'Кого ждем', offset: 0, duration: 500 },
  { id: ENAV.NOMINATIONS, name: 'Номинации', offset: 0, duration: 750 },
  { id: ENAV.STAGES, name: 'Этапы', offset: 0, duration: 1000 },
  { id: ENAV.FAQ, name: 'Ответы на вопросы', offset: 0, duration: 1250 },
  { id: ENAV.DOCUMENT, name: 'Документы', offset: 0, duration: 1500 },
];

export const NavFooterLinks: INavigationLink[] = [
  { id: ENAV.DESCRIPTION, name: 'О конкурсе', offset: -20, duration: 1500 },
  { id: ENAV.RECRUITMENT, name: 'Кого ждем', offset: 0, duration: 1250 },
  { id: ENAV.NOMINATIONS, name: 'Номинации', offset: 0, duration: 1000 },
  { id: ENAV.STAGES, name: 'Этапы', offset: 0, duration: 750 },
  { id: ENAV.FAQ, name: 'Ответы на вопросы', offset: 0, duration: 500 },
  { id: ENAV.DOCUMENT, name: 'Документы', offset: 0, duration: 250 },
];
