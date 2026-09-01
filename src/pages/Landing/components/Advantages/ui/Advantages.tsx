import type { FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { advantagesData } from '../lib/data';

import '../styles/style.css';

interface IAdvantagesProps {
  windowWidth: number;
}

export const Advantages: FC<IAdvantagesProps> = ({ windowWidth }) => {

  return (
    <div className='advantages' id={ENAV.ADVANTAGES}>
      <div className='advantages__container'>
        <h2 className='advantages__title'>ЗАЧЕМ УЧАСТВОВАТЬ?</h2>
        {windowWidth < 1000 && <p className='advantages__item-stub'>{advantagesData.find((elem => elem.id === 6))?.text}</p>}
        <ul className='advantages__list'>
          {advantagesData.map((item) => (
            item.id !== 6
            ?
            <div className={`advantages__item advantages__item_type_${item.id}`} key={item.id}>
              <span className='advantages__item-count'>0{item.id}</span>
              <h4 className='advantages__item-title'>{item.title}</h4>
              <h4 className='advantages__item-text'>{item.text}</h4>
            </div>
            :
            windowWidth > 1000 &&
            <p className='advantages__item-stub' key={item.id}>{item.text}</p>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Advantages;
