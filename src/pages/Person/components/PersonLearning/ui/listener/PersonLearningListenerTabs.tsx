import type { FC } from 'react';

import type { IPersonLearningListenerTabsProps } from '../../interface/interface';

import { listenerTabs } from '../../mock/listenerContent';

import '../../styles/style.css';

const PersonLearningListenerTabs: FC<IPersonLearningListenerTabsProps> = ({
  activeTab,
  onChange,
  confirmedSections,
  tabs = listenerTabs,
}) => {
  return (
    <ul className='person-learning-tabs'>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const isCompleted =
          tab.id !== 'review' &&
          confirmedSections[tab.id as keyof typeof confirmedSections];

        let stateClass = 'person-learning-tabs__item_default';

        if (isActive) {
          stateClass = 'person-learning-tabs__item_active';
        } else if (isCompleted) {
          stateClass = 'person-learning-tabs__item_completed';
        }

        return (
          <li
            key={tab.id}
            className={`person-learning-tabs__item ${stateClass}`}
            onClick={() => onChange(tab.id)}
          >
            {isCompleted && (
              <span className='person-learning-tabs__check' aria-hidden='true' />
            )}
            <span className='person-learning-tabs__label'>{tab.label}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default PersonLearningListenerTabs;
