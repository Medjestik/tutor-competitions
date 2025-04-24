import type { FC } from 'react';

import { getCurrentYear } from '../../../../../utils/getCurrentYear';
import { supportLink } from '../../../../../utils/socail';

import '../styles/style.css';

const LayoutFooter: FC = () => {
  return (
    <footer className='layout-footer'>
      <span className='layout-footer__copy'>&copy;{getCurrentYear()} Все права защищены, РУТ (МИИТ)</span>
      <a className='layout-footer__support' href={supportLink} target='_blanc'>Техническая поддержка</a>
    </footer>
  );
};

export default LayoutFooter;
