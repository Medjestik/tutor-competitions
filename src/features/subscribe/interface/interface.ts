import type { IFormError } from '../../../shared/components/Form/interface/interface';

export interface ISubscribeData {
  mail: string;
}

export interface ISubscribePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ISubscribeData) => void;
  subscribeError: IFormError;
  isLoadingRequest: boolean;
}
