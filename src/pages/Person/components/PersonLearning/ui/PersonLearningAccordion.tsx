import type { FC } from 'react';
import type { IPersonLearningAccordionProps } from '../interface/interface';

import PersonLearningAccordionItem from './PersonLearningAccordionItem';

import '../styles/style.css';

const PersonLearningAccordion: FC<IPersonLearningAccordionProps> = ({ items }) => {
  return (
    <ul className='person-learning-accordion'>
      {items.map((item) => (
        <PersonLearningAccordionItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default PersonLearningAccordion;
