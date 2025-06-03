import type { FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

const Recruitment: FC = () => {
  return (
    <div className='recruitment' id={ENAV.RECRUITMENT}>
      <div className='recruitment__info'>
        <h2 className='recruitment__title'>КОГО ЖДЕМ?</h2>
        <p className='recruitment__subtitle'>Если вы готовы делиться опытом, продвигать инженерное образование и&nbsp;вдохновлять других – этот конкурс для&nbsp;вас!</p>
      </div>
      <ul className='recruitment__list'>
        <li className='recruitment__item'>
          <span className='recruitment__item-count'>/01</span>
          <h4 className='recruitment__item-title'>Преподавателей транспортных вузов</h4>
          <p className='recruitment__item-text'>внедряющих новые подходы в&nbsp;обучение</p>
        </li>
        <li className='recruitment__item'>
          <span className='recruitment__item-count'>/02</span>
          <h4 className='recruitment__item-title'>Руководителей научных групп</h4>
          <p className='recruitment__item-text'>вовлекающих студентов в&nbsp;реальные исследования и&nbsp;передовые технологические разработки</p>
        </li>
        <li className='recruitment__item'>
          <span className='recruitment__item-count'>/03</span>
          <h4 className='recruitment__item-title'>Административный состав</h4>
          <p className='recruitment__item-text'>развивающий университетскую среду и&nbsp;связывающих образование с&nbsp;индустрией</p>
        </li>
      </ul>
    </div>
  );
};

export default Recruitment;
