import type { FC } from 'react';

import Section from '../../../../../shared/components/Section/ui/Section';
import Accordion from '../../../../../widgets/Accordion/ui/Accordion';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { data } from '../mock/data';

import '../styles/style.css';

const FAQ: FC = () => {
  return (
    <div className='faq' id={ENAV.FAQ}>
      <Section>
        <div className='faq__section'>
          <h2 className='section__title faq__title'>ответы на частые вопросы</h2>
          <Accordion items={data} />
        </div>
      </Section>
    </div>
  );
};

export default FAQ;
