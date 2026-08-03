import type { FC } from 'react';
import type { IPersonLearningFaqProps } from '../interface/interface';

import Button from '../../../../../shared/components/Button/ui/Button';
import PersonLearningAccordion from './PersonLearningAccordion';

import { faqData } from '../mock/faqData';

import '../styles/style.css';

const PersonLearningFaq: FC<IPersonLearningFaqProps> = ({ onBack, onUpload }) => {
  return (
    <>
      <PersonLearningAccordion items={faqData} />

      <div className='person-learning__footer person-learning__footer_split'>
        <Button
          text='Назад'
          color='primary'
          onClick={onBack}
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 500,
            height: '48px',
            minWidth: '96px',
            padding: '16px 24px',
            lineHeight: 1,
            background: '#f4f8ff',
            border: 'none',
          }}
        />
        <Button
          text='Загрузить документы'
          color='gradient'
          onClick={onUpload}
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 500,
            height: '48px',
            minWidth: '208px',
            padding: '16px 24px',
            lineHeight: 1,
          }}
        />
      </div>
    </>
  );
};

export default PersonLearningFaq;
