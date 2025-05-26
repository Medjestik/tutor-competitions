import type { FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

const Recruitment: FC = () => {
  return (
    <div className='recruitment' id={ENAV.RECRUITMENT}>
      <div className='recruitment__info'>
        <h2 className='recruitment__title'>Кого ждем?</h2>
        <p className='recruitment__subtitle'>Если вы готовы делиться опытом, продвигать инженерное образование и вдохновлять других – этот конкурс для вас.</p>
      </div>
      <ul className='recruitment__list'>
        <li className='recruitment__item'>
          <span className='recruitment__item-count'>/01</span>
          <h4 className='recruitment__item-title'>Преподавателей транспортных вузов</h4>
          <p className='recruitment__item-text'>внедряющих новые подходы в обучение</p>
        </li>
        <li className='recruitment__item'>
          <span className='recruitment__item-count'>/02</span>
          <h4 className='recruitment__item-title'>Руководителей научных групп</h4>
          <p className='recruitment__item-text'>вовлекающих студентов в реальные исследования и передовые технологические разработки</p>
        </li>
        <li className='recruitment__item'>
          <span className='recruitment__item-count'>/03</span>
          <h4 className='recruitment__item-title'>Административный состав</h4>
          <p className='recruitment__item-text'>развивающий университетскую среду и связывающих образование с индустрией</p>
        </li>
      </ul>
    </div>
  );
};

export default Recruitment;
