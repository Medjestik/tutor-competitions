import type { FC } from 'react';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';

import '../styles/style.css';

const PersonStageInitial: FC = () => {

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Начало</h2>
      <div className='person-stage__container'>
        <div className='person-stage__info'>
          <p className='person-stage__subtitle'>Мы рады приветствовать вас на&nbsp;Всероссийском конкурсе лучших педагогических практик «Лидеры транспортного образования»!</p>
          <p className='person-stage__subtitle'>Для подачи вашей практики на&nbsp;конкурс перейдите на&nbsp;страницу заполнения анкеты в&nbsp;разделе слева – кнопка «01».</p>
          <p className='person-stage__subtitle'>При заполнении анкеты постарайтесь максимально конкретно отвечать на&nbsp;вопросы, описывая практику коротко, но&nbsp;содержательно.</p>
          <p className='person-stage__subtitle'>Желаем удачи!</p>
        </div>
        <PersonVideo url='https://course.emiit.ru/webtutor/ivan/land/video/video1.mp4' />
      </div>
    </div>
  );
};

export default PersonStageInitial;
