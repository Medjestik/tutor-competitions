import type { FC } from 'react';

import Section from '../../../../../shared/components/Section/ui/Section';
import StagesCard from './StagesCard';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { data } from '../mock/data';

import '../styles/style.css';

const Stages: FC = () => {

  return (
    <div className='stages' id={ENAV.STAGES}>
      <Section>
        <div className='stages__section'>
          <h2 className='section__title'>Этапы соревнования</h2>
          <ul className='stages__list'>
            {
              data.map((card) => (
                <StagesCard card={card} key={card.id} />
              ))
            }
          </ul>
        </div>
      </Section>
    </div>
  );
};

export default Stages;
