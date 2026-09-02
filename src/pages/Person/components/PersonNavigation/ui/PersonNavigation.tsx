import type { FC } from 'react';
import type { IPersonNavigationProps, IStageNavItem } from '../../../interface/interface';

import { learningNavItems } from '../../../lib/stages';

import PersonNavItem from './PersonNavItem';

import '../styles/style.css';

const formatStageNumber = (position: number) => String(position).padStart(2, '0');

const PersonNavigation: FC<IPersonNavigationProps> = ({
  stages,
  openStageId,
  onChange,
  openLearningId,
  onLearningChange,
  isEducationEnabled,
}) => {

  const resolveState = (stage: IStageNavItem) => {
    if (openLearningId) {
      return stage.type === 'block' ? 'block' as const : 'default' as const;
    }
    if (stage.id === openStageId) {
      return 'active' as const;
    }
    if (stage.type === 'block') {
      return 'block' as const;
    }
    return 'default' as const;
  };

  return (
    <aside className='person__nav'>
      <div className='person__nav-card'>
        <h2 className='person__nav-card-title'>Этапы конкурса</h2>
        <ul className='person__nav-list'>
          {
            stages.map((stage) => {
              const state = resolveState(stage);
              const isHome = stage.view === 'info';

              return (
                <PersonNavItem
                  key={stage.id}
                  title={stage.name}
                  description={stage.description}
                  number={isHome ? undefined : formatStageNumber(stage.position)}
                  state={state}
                  isHome={isHome}
                  onClick={state !== 'block' ? () => onChange(stage) : undefined}
                />
              );
            })
          }
        </ul>
      </div>

      {isEducationEnabled && (
        <div className='person__nav-card person__nav-card_learning'>
          <h2 className='person__nav-card-title'>Обучение</h2>
          <ul className='person__nav-list'>
            {
              learningNavItems.map((item) => (
                <PersonNavItem
                  key={item.id}
                  title={item.name}
                  description={item.description}
                  number={item.number}
                  state={openLearningId === item.id ? 'active' : 'default'}
                  onClick={() => onLearningChange(item)}
                />
              ))
            }
          </ul>
        </div>
      )}
    </aside>
  );
};

export default PersonNavigation;
