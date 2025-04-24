import type { FC } from 'react';

import Section from '../../../../../shared/components/Section/ui/Section';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

const Recruitment: FC = () => {
  return (
    <div className='recruitment' id={ENAV.RECRUITMENT}>
      <Section>
        <div className='recruitment__section'>
          <h2 className='section__title'>Кого ждем?</h2>
          <p className='section__subtitle'>Мы приглашаем студентов бакалавриата и специалитета 1–6 курсов очной формы обучения из любых транспортных вузов страны. Работа над проблемами будет непростой, поэтому участие возможно только командное — заявки принимаются от команд из 4 человек.</p>
          <p className='section__subtitle'>Присоединяйтесь и станьте частью будущего транспортной отрасли!</p>
        </div>
      </Section>
      <div className='recruitment__img'></div>
    </div>
  );
};

export default Recruitment;
