import type { FC } from 'react';

import '../styles/style.css';

const Preloader: FC = () => {
  return (
    <figure className='preloader'>
      <i className='preloader__circle'></i>
      <figcaption className='preloader__caption'>Идёт загрузка...</figcaption>
    </figure>
  );
};

export default Preloader;
