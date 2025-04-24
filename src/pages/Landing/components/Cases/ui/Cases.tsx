import type { FC } from 'react';
import type { ICaseItem } from '../../../../../features/case/interface/interface';

import Section from '../../../../../shared/components/Section/ui/Section';
import CasesCard from './CasesCard';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface ICasesProps {
  cases: ICaseItem[];
}

const Cases: FC<ICasesProps> = ({ cases }) => {

  return (
    <div className='cases' id={ENAV.CASES}>
      <Section>
        <div className='cases__section'>
          <h2 className='section__title'>Кейсы соревнования</h2>
          <ul className='cases__list'>
            {
              cases.map((card: ICaseItem) => (
                <CasesCard card={card} key={card.id} />
              ))
            }
          </ul>
        </div>
      </Section>
    </div>
  );
};

export default Cases;
