import type { FC } from 'react';

import Accordion from '../../../../../widgets/Accordion/ui/Accordion';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { data } from '../mock/data';

import '../styles/style.css';

interface INominationsProps {
  windowWidth: number;
}


const Nominations: FC<INominationsProps> = ({ windowWidth }) => {
  return (
    <div className='nominations' id={ENAV.NOMINATIONS}>
      <div className='nominations__info'>
        <h2 className='nominations__title'>{windowWidth > 1000 ? 'НОМИ- НАЦИИ' : 'НОМИНАЦИИ'}</h2>
        <p className='nominations__text'>Номинации отражают современные подходы к&nbsp;профессиональной подготовке студентов, к&nbsp;цифровой трансформации и&nbsp;эффективному партнёрству.</p>
      </div>
      <Accordion items={data} />
    </div>
  );
};

export default Nominations;
