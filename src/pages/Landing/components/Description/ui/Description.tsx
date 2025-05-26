import type { FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IDescriptionProps {
  windowWidth: number;
}

const Description: FC<IDescriptionProps> = ({ windowWidth }) => {

  console.log(windowWidth);

  return (
    <div className='description' id={ENAV.DESCRIPTION}>
      <span className='description__subtitle'>О конкурсе</span>
      <h2 className='description__title'>ЧТО&nbsp;ТАКОЕ&nbsp;КОНКУРС ОБРАЗОВАТЕЛЬНЫХ&nbsp;ПРАКТИК?</h2>
      <div className='description__container'>
        <div className='description__img'></div>
        <p className='description__text'>Всероссийский конкурс для транспортных вузов, где представляют эффективные и оригинальные подходы к обучению.</p>
      </div>
      <div className='description__info'>
        <p className='description__info-text'>Мы ищем практики, которые действительно работают: цифровые инструменты, проекты со студентами, взаимодействие с индустрией, формирование современных навыков и создание уникальной университетской среды.</p>
        <p className='description__info-text'>Здесь ваш опыт может стать примером и двигателем изменений.</p>
        <span className='description__info-link'>Подробнее</span>
      </div>
    </div>
  );
};

export default Description;
