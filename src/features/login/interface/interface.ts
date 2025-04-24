import type { IFormError } from '../../../shared/components/Form/interface/interface';

export interface ILoginData {
  login: string;
  password: string;
}

export interface ILoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ILoginData) => void;
  loginError: IFormError;
  isLoadingRequest: boolean;
}
