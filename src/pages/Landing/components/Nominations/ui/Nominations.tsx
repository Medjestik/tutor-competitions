import type { FC } from 'react';

import Accordion from '../../../../../widgets/Accordion/ui/Accordion';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { data } from '../mock/data';

import '../styles/style.css';

const Nominations: FC = () => {
  return (
    <div className='nominations' id={ENAV.NOMINATIONS}>
      <div className='nominations__info'>
        <h2 className='nominations__title'>НОМИ- НАЦИИ</h2>
        <p className='nominations__text'>Эти номинации отражают современные подходы, способствующие развитию студенческого опыта, цифровой трансформации и&nbsp;эффективному партнёрству.</p>
      </div>
      <Accordion items={data} />
    </div>
  );
};

export default Nominations;
