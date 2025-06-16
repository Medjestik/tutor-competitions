export interface ITabsProps {
  rootPath: string;
  tabs: ITab[];
}

export interface ITab {
  name: string;
  location: string;
  id: string;
}
