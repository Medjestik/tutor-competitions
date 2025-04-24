import type { FC } from 'react';
import type { IPersonNavigationProps, IStageNavItem } from '../../../interface/interface';

import '../styles/style.css';

const PersonNavigation: FC<IPersonNavigationProps> = ({ stages, openStageId, onChange }) => {

  const renderNavText = (stage: IStageNavItem) => {
    switch (stage.view) {
      case 'info':
        return (
          <div className='person__nav-icon-home'></div>
        );
      default:
        return (
          <span>0{stage.position || ''}</span>
        );
    }
  };

  const renderNavItem = (stage: IStageNavItem, type: string) => {
    const itemClass = `person__nav-item person__nav-item_type_${type}`;
    switch (type) {
      case 'active':
        return (
          <li key={stage.id} className={itemClass}>
            {renderNavText(stage)}
          </li>
        );
      case 'block':
        return (
          <li key={stage.id} className={itemClass}>
            {renderNavText(stage)}
          </li>
        );
      default:
        return (
          <li key={stage.id} className={itemClass} onClick={() => onChange(stage)} >
            {renderNavText(stage)}
          </li>
        );
    }
  };

  return (
    <nav className='person__nav'>
      <ul className='person__nav-list'>
        {
          stages.map((stage) => {
            const type = stage.id === openStageId
              ? 'active'
              : stage.type !== 'block'
              ? 'default'
              : 'block';

            return renderNavItem(stage, type);
          })
        }
      </ul>
    </nav>
  );
};

export default PersonNavigation;
