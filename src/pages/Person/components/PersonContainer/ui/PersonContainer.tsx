import type { FC } from 'react';
import type { IPersonContainerProps } from '../../../interface/interface';

import '../styles/style.css';

const PersonContainer: FC<IPersonContainerProps> = ({ children }) => {

  return (
    <div className='person-container'>
      {children}
    </div>
  );
};

export default PersonContainer;
