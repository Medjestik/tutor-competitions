import type { FC } from 'react';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';

import '../styles/style.css';

const PersonStageInitial: FC = () => {

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Начало</h2>
      <div className='person-stage__container'>
        <div className='person-stage__info'>
          <p className='person-stage__subtitle'>Мы рады приветствовать вас на Всероссийском конкурсе лучших образовательных практик "Опыт в движении"!</p>
          <p className='person-stage__subtitle'>Для подачи вашей практики на конкурс перейдите на страницу заполнения анкеты в разделе слева.</p>
          <p className='person-stage__subtitle'>При заполнении анкеты постарайтесь максимально конкретно отвечать на вопросы, описывая практику коротко, но содержательно.</p>
          <p className='person-stage__subtitle'>Желаем удачи!</p>
        </div>
        <PersonVideo url='' isEmpty={true} />
      </div>
    </div>
  );
};

export default PersonStageInitial;
