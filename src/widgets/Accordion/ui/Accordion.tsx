import type { FC } from 'react';

import { IAccordion } from '../interface/interface';
import AccordionItem from './AccordionItem';

import '../styles/style.css';

const Accordion: FC<IAccordion> = ({ items }) => {
  return (
    <ul className='accordion'>
      {items.map((item) => (
        <AccordionItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default Accordion;
