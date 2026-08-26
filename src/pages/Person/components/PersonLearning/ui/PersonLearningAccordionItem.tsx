import type { FC } from 'react';
import type { IPersonLearningAccordionItemProps } from '../interface/interface';

import { useRef, useState } from 'react';

import '../styles/style.css';

const PersonLearningAccordionItem: FC<IPersonLearningAccordionItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('0px');
  const childrenRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (childrenRef.current) {
      setHeight(isOpen ? '0px' : `${childrenRef.current.scrollHeight}px`);
    }
  };

  return (
    <li
      className={`person-learning-accordion__item ${
        isOpen ? 'person-learning-accordion__item_open' : ''
      }`}
      onClick={handleToggle}
    >
      <div className='person-learning-accordion__main'>
        <h4 className='person-learning-accordion__title'>{item.title}</h4>
        <div className='person-learning-accordion__icon' />
      </div>
      <div
        style={{ maxHeight: height }}
        ref={childrenRef}
        className='person-learning-accordion__children'
        onClick={(event) => event.stopPropagation()}
      >
        <p className='person-learning-accordion__text'>{item.content}</p>
      </div>
    </li>
  );
};

export default PersonLearningAccordionItem;
