export interface ISubscribeData {
  mail: string;
}

export interface ISubscribePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ISubscribeData) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeError: any;
  isLoadingRequest: boolean;
}
