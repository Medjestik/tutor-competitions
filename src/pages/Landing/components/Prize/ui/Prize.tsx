import type { FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

const Prize: FC = () => {

  return (
    <div className='prize' id={ENAV.PRIZE}>
      <h2 className='prize__title'>ПРИЗОВОЙ&nbsp;ФОНД 1&nbsp;МИЛЛИОН&nbsp;РУБЛЕЙ</h2>
      <p className='prize__caption'>Здесь ваш опыт может стать примером и двигателем изменений.</p>
    </div>
  );
};

export default Prize;
