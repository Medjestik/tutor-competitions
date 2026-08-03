import type { FC } from 'react';
import type { IPersonLearningTabsProps, TLearningTab } from '../interface/interface';

import '../styles/style.css';

const tabs: { id: TLearningTab; label: string }[] = [
  { id: 'about', label: 'О программе' },
  { id: 'faq', label: 'Вопросы и ответы' },
];

const PersonLearningTabs: FC<IPersonLearningTabsProps> = ({ activeTab, onChange }) => {
  return (
    <ul className='person-learning-tabs'>
      {tabs.map((tab) => (
        <li
          key={tab.id}
          className={`person-learning-tabs__item person-learning-tabs__item_${
            activeTab === tab.id ? 'active' : 'default'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
};

export default PersonLearningTabs;
