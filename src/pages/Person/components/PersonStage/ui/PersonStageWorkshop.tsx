import type { FC } from 'react';

import workshopImg from '../../../../../shared/images/workshop.svg';

import '../styles/style.css';

const PersonStageWorkshop: FC = () => {

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Расписание мастер-классов</h2>
      <p className='person-stage__subtitle'>Здесь скоро появится расписание онлайн-мастер-классов — мы уже работаем над ним и скоро всё опубликуем. Следите за обновлениями!</p>
      <img className="person-stage__img" src={workshopImg} alt='изображение'></img>
      <div className='person-stage__container'>
      </div>
    </div>
  );
};

export default PersonStageWorkshop;
