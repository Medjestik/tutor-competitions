export interface ISelectOption {
  id: number;
  name: string;
}

export interface ISelectWithSearchProps {
  options: ISelectOption[];
  currentOption: ISelectOption;
  onChooseOption: (option: ISelectOption) => void;
}
