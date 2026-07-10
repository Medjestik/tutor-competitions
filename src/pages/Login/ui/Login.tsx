import type { FC } from 'react';

import PublicLayout from '../../../shared/components/Layout/ui/PublicLayout';
import PublicHeader from '../../../shared/components/Layout/components/PublicHeader/ui/PublicHeader';
import PublicFooter from '../../../shared/components/Layout/components/PublicFooter/ui/PublicFooter';
import { Card } from '../../../shared/components/Card/ui';
import LoginForm from './login-form';

import styles from '../styles/login.module.scss';


const Login: FC = () => {

  return (
    <PublicLayout>
      <PublicHeader />
      <main className={styles.main}>
        <div className={styles.info}>
          <span className={styles.caption}>Международный конкурс лучших образовательных практик «Лидеры&nbsp;транспортного&nbsp;образования» </span>
          <h1 className={styles.title}>Вход в&nbsp;личный кабинет&nbsp;участника</h1>
          <p className={styles.subtitle}>Доступ к&nbsp;материалам конкурса и&nbsp;курсу повышения квалификации в&nbsp;едином пространстве.</p>
        </div>
        <div className={styles.form}>
          <Card title='Вход' subtitle='Войдите в свой аккаунт, чтобы начать участие в конкурсе'>
            <LoginForm />
          </Card>
        </div>
      </main>
      <PublicFooter withCopy={false} />
    </PublicLayout>
  );
};

export default Login; 
