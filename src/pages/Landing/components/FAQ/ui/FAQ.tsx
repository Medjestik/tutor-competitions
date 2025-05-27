import type { FC } from 'react';

import Accordion from '../../../../../widgets/Accordion/ui/Accordion';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { data } from '../mock/data';

import '../styles/style.css';

const FAQ: FC = () => {
  return (
    <div className='faq' id={ENAV.FAQ}>
      <h2 className='faq__title'>ВОПРОС- ОТВЕТ</h2>
      <Accordion items={data} />
    </div>
  );
};

export default FAQ;
