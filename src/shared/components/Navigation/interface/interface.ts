export interface INavigationLink {
  id: string;
  name: string;
  offset: number;
  duration: number;
}

export interface INavigationProps {
  links: INavigationLink[];
  color: 'default' | 'white';
  onClick?: () => void; 
}

export enum ENAV {
  DESCRIPTION = 'description',
  STAGES = 'stages',
  CASES = 'cases',
  RECRUITMENT = 'recruitment',
  FAQ = 'faq',
  DOCUMENT = 'document',
  LEADERBOARD = 'leaderboard',
}

export const NavHeaderLinks: INavigationLink[] = [
  { id: ENAV.DESCRIPTION, name: 'о соревнованиях', offset: 0, duration: 250 },
  { id: ENAV.STAGES, name: 'этапы', offset: 0, duration: 500 },
  { id: ENAV.CASES, name: 'кейсы', offset: 0, duration: 750 },
  { id: ENAV.RECRUITMENT, name: 'кого ждем', offset: 0, duration: 1000 },
  { id: ENAV.FAQ, name: 'ответы на вопросы', offset: 0, duration: 1250 },
  { id: ENAV.DOCUMENT, name: 'документы', offset: 0, duration: 1500 },
];

export const NavFooterLinks: INavigationLink[] = [
  { id: ENAV.DESCRIPTION, name: 'о соревнованиях', offset: 0, duration: 1500 },
  { id: ENAV.STAGES, name: 'этапы', offset: 0, duration: 1250 },
  { id: ENAV.CASES, name: 'кейсы', offset: 0, duration: 1000 },
  { id: ENAV.RECRUITMENT, name: 'кого ждем', offset: 0, duration: 750 },
  { id: ENAV.FAQ, name: 'ответы на вопросы', offset: 0, duration: 500 },
  { id: ENAV.DOCUMENT, name: 'документы', offset: 0, duration: 250 },
];
