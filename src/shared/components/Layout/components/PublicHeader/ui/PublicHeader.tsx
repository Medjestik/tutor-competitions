import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../../../Button/ui/Button';

import { EROUTES } from '../../../../../utils/ERoutes';

import styles from '../styles/public-header.module.scss';


const PublicHeader: FC = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header} id='header'>
      <div className={styles.logos}>
        <div className={`${styles.logo} ${styles.logo_min}`}></div>
        <div className={`${styles.logo} ${styles.logo_rut}`}></div>
      </div>
      <Button text='На главную' color='gradient' onClick={() => navigate(EROUTES.LANDING)} />
    </header>
  );
};

export default PublicHeader;
