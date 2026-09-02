import type { FC } from 'react';

import Button from '../../../shared/components/Button/ui/Button';

import heroImage from '../../../shared/images/registration-hero.png';

import styles from '../styles/registration.module.scss';

interface IRegistrationHeroProps {
  onStart: () => void;
}

const RegistrationHero: FC<IRegistrationHeroProps> = ({ onStart }) => {
  return (
    <main className={styles.main}>
      <div className={styles.heroRow}>
        <div className={styles.hero}>
          <span className={styles.caption}>
            Международный конкурс лучших образовательных практик
          </span>
          <h1 className={styles.title}>Регистрация участника</h1>
          <p className={styles.subtitle}>
            Подайте заявку на участие в конкурсе лучших образовательных практик и
            представьте свой опыт транспортному сообществу страны.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>Регистрация занимает 3 минуты</span>
            <span className={styles.badge}>Создание личного кабинета</span>
            <Button
              text="Начать регистрацию"
              color="gradient"
              onClick={onStart}
              withIcon={{ type: 'next', position: 'right', color: 'white' }}
            />
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img
            className={styles.heroImage}
            src={heroImage}
            alt="Участники конкурса"
          />
        </div>
      </div>
    </main>
  );
};

export default RegistrationHero;
