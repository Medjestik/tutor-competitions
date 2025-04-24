import type { FC } from 'react';
import type { ICaseListProps, ICaseItem } from '../interface/interface';

import CaseItem from './CaseItem';

import '../styles/style.css';

const CaseList: FC<ICaseListProps> = ({ items, selectItemId, onSelect, onDetail, windowWidth }) => {

  return (
    <ul className='case-list'>
      {
        items.map((item: ICaseItem) => (
          <CaseItem
            item={item} 
            key={item.id} 
            selectItemId={selectItemId} 
            onSelect={onSelect}
            onDetail={onDetail}
            windowWidth={windowWidth}
          />
        ))
      }
    </ul>
  );
};

export default CaseList;
