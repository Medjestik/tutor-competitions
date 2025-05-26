import type { PropsWithChildren, } from 'react';
import type { IFormData, ICriteria } from '../../../../pages/Person/interface/interface';

export interface IEvaluation {
  participant_form?: number;
  criteria?: number;
  score?: string;
  comment?: string;
}

export interface IPopupProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  popupWidth?: 'small' | 'medium' | 'large' | 'full' | 'default' | 'mobile';
  closeOutside?: boolean;
}

export interface IConfirmRemovePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
}

export interface ISetScorePopupProps {
  isOpen: boolean;
  onClose: () => void;
  form: IFormData;
  isLoading: boolean;
  onScore: (data: ICriteria[]) => void;
}

export interface IUploadFile {
  file: string | null;
  fileName: string;
  name: string;
}

export interface IUploadLink {
  link: string;
  name: string;
}

export interface IUploadFilePopupProps {
  isOpen: boolean;
  isLoading: boolean;
  isShowRequestError: boolean;
  onClose: () => void;
  onUpload: (file: IUploadFile) => void;
}

export interface IUploadLinkPopupProps {
  isOpen: boolean;
  isLoading: boolean;
  isShowRequestError: boolean;
  onClose: () => void;
  onUpload: (data: IUploadLink) => void;
}
