import type { FC } from 'react';

import PublicLayout from '../../../shared/components/Layout/ui/PublicLayout';
import PublicHeader from '../../../shared/components/Layout/components/PublicHeader/ui/PublicHeader';
import PublicFooter from '../../../shared/components/Layout/components/PublicFooter/ui/PublicFooter';
import { Card } from '../../../shared/components/Card/ui';
import ResetPasswordForm from './reset-password-form';

import styles from '../styles/reset-password.module.scss';

const ResetPassword: FC = () => {
	return (
		<PublicLayout>
			<PublicHeader />
			<main className={styles.main}>
				<div className={styles.info}>
					<span className={styles.caption}>
						Международный конкурс лучших образовательных практик
						«Лидеры&nbsp;транспортного&nbsp;образования»{' '}
					</span>
					<h1 className={styles.title}>Новый пароль</h1>
					<p className={styles.subtitle}>
						Придумайте новый пароль для входа в личный кабинет.
					</p>
				</div>
				<div className={styles.form}>
					<Card
						title="Установка пароля"
						subtitle="Введите новый пароль и подтвердите его"
					>
						<ResetPasswordForm />
					</Card>
				</div>
			</main>
			<PublicFooter withCopy={false} />
		</PublicLayout>
	);
};

export default ResetPassword;
