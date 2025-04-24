import type { FC } from 'react';
import type { ICasesCardProps } from '../interface/interface';

import '../styles/style.css';

const CasesCard: FC<ICasesCardProps> = ({ card}) => {
  return (
    <li className='cases__card'>
      <h4 className='cases__card-title'>Ситуация</h4>
      <p className='cases__card-text'>{card.situation}</p>
      <h4 className='cases__card-title cases__card-title_type_problem'>Сбой</h4>
      <p className='cases__card-text'>{card.problem}</p>
      <div className='cases__card-footer'>
        <img className='cases__card-icon' src={card.icon} alt='иконка'></img>
      </div>
    </li>
  );
};

export default CasesCard;
