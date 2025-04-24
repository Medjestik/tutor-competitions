export interface IAccordionItem {
  id: number;
  title: string;
  content: string;
}

export interface IAccordionItemProps {
  item: IAccordionItem;
}

export interface IAccordion {
  items: IAccordionItem[];
}
