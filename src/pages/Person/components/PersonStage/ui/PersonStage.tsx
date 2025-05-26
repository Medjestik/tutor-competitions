import type { FC } from 'react';

import '../styles/style.css';

const PersonStage: FC = () => {

  return (
    <div className='person-stage'>
      <span className='person-stage__number'>Этап 1 / 6</span>
      <h2 className='person-stage__title'>123</h2>
      <div className='person-stage__container'>
        <div className='person-stage__video'>

        </div>
        <div className='person-stage__info'>

        </div>
      </div>
    </div>
  );
};

export default PersonStage;
