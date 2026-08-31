import type { FC } from 'react';

import Button from '../../../shared/components/Button/ui/Button';
import { Card } from '../../../shared/components/Card/ui';
import { EROUTES } from '../../../shared/utils/ERoutes';

import styles from '../styles/registration.module.scss';

const RegistrationClosed: FC = () => {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <span className={styles.caption}>
          Международный конкурс лучших образовательных практик
        </span>
        <h1 className={styles.title}>Регистрация участника</h1>
      </div>
      <div className={styles.closedCard}>
        <Card title="Регистрация">
          <p className={styles.closedText}>Регистрация закрыта</p>
        </Card>
      </div>
      <div className={styles.badges}>
        <Button
          type="link"
          text="На главную"
          color="gradient"
          href={EROUTES.LANDING}
        />
      </div>
    </main>
  );
};

export default RegistrationClosed;
