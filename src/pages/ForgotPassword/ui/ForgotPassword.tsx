import type { FC } from 'react';

import PublicLayout from '../../../shared/components/Layout/ui/PublicLayout';
import PublicHeader from '../../../shared/components/Layout/components/PublicHeader/ui/PublicHeader';
import PublicFooter from '../../../shared/components/Layout/components/PublicFooter/ui/PublicFooter';
import { Card } from '../../../shared/components/Card/ui';
import ForgotPasswordForm from './forgot-password-form';

import styles from '../styles/forgot-password.module.scss';

const ForgotPassword: FC = () => {
	return (
		<PublicLayout>
			<PublicHeader />
			<main className={styles.main}>
				<div className={styles.info}>
					<span className={styles.caption}>
						Международный конкурс лучших образовательных практик
						«Лидеры&nbsp;транспортного&nbsp;образования»{' '}
					</span>
					<h1 className={styles.title}>Восстановление пароля</h1>
					<p className={styles.subtitle}>
						Укажите email, указанный при регистрации. Мы отправим ссылку для
						установки нового пароля.
					</p>
				</div>
				<div className={styles.form}>
					<Card
						title="Восстановление пароля"
						subtitle="На указанный email придёт письмо со ссылкой. Ссылка действует 1 час."
					>
						<ForgotPasswordForm />
					</Card>
				</div>
			</main>
			<PublicFooter withCopy={false} />
		</PublicLayout>
	);
};

export default ForgotPassword;
