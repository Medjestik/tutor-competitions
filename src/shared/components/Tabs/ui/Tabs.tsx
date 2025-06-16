import type { FC } from 'react';
import type { ITabsProps, ITab } from '../interface/interface';

import { useLocation, useNavigate } from 'react-router-dom';

import '../styles/style.css';

const Tabs: FC<ITabsProps> = ({ rootPath, tabs }) => {

  const location = useLocation();
  const navigate = useNavigate();

  function switchTab(tab: ITab) {
    navigate(rootPath + '/' + tab.location);
  }

  return (
    <ul className='tabs'>
      {
        tabs.map((elem: ITab, i: number) => (
          location.pathname.includes(elem.location)
          ?
          <li key={i} className={'tabs__item tabs__item_type_current'}>{elem.name}</li>
          :
          <li key={i} onClick={() => switchTab(elem)} className={'tabs__item tabs__item_type_active'}>{elem.name}</li>
        ))
      }
    </ul>
  );
};

export default Tabs;
