import type { PropsWithChildren, } from 'react';

export interface IStageFormProps {
  onNextStage: () => void;
}

export interface ISelectNomination {
  name: string;
  id: number;
}

export interface INomination {
  name: string;
  id: number;
  position: number;
  total_forms: number;
}

export interface IItemForm {
  total_evaluations: number;
  name: string;
  id: number;
  average_score: number;
  is_evaluated: boolean;
  nomination: number;
  status: string;
}

export interface IFormData {
  description: string;
  id: number;
  name: string;
  nomination: number;
  nomination_name: string;
  originality: string;
  educational_organization: string;
  status: string;
  task: string;
  text: string;
  usability: string;
  user: number;
  resources: IResource[];
  evaluation_details: ICriteria[];
}

export interface IScoreItem {
  participant_form: number,
  indicator: number,
  score: number,
  comment: string
}

export interface ICriteria {
  criteria_id: number;
  criteria_name: string;
  indicators: IIndicator[];
}

export interface IIndicator {
  id: number;
  comment: string;
  name: string;
  position: number;
  score: number | null;
}

export interface IResource {
  description: string;
  file?: string;
  id: number;
  link?: string;
  type: string;
}

export interface IStageNavItem {
  name: string;
  description?: string;
  id: number; 
  route: string;
  is_active: boolean;
  position: number;
  start_date?: string;
  end_date?: string;
  type: string;
  view: string;
  url_template: string;
  url_video: string;
  team_file_count: number;
  team_videos: string[];
}

export interface IStage {
  name: string;
  id: number; 
  is_active: boolean;
  position: number;
  start_date?: string;
  end_date?: string;
  url_template: string;
  url_video: string;
  team_file_count: number;
  team_videos: string[];
}

export interface IPersonProps {
  windowWidth: number;
  onLogout:() => void;
  onChangeStage:(stageId: number) => void;
}

export interface IPersonNavigationProps {
  stages: IStageNavItem[];
  openStageId: number; 
  onChange: (stage: IStageNavItem) => void;
}

export interface IPersonContainerProps extends PropsWithChildren {
  windowWidth?: number;
}

export interface IPersonStageProps {
  stage: IStageNavItem;
  onOpen?: () => void;
  onLink?: () => void;
  onUploadVideo?: () => void;
  onChangeStage?: () => void;
}
