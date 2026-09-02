import type { FC, FormEvent } from 'react';
import type { IForgotPasswordForm } from '../interface/interface';

import { useEffect, useState } from 'react';
import { useForm } from '../../../shared/hooks/useForm';

import { Form } from '../../../shared/components/Form/ui/Form';
import {
	FormField,
	FormButtons,
	FormInput,
	FormLinks,
} from '../../../shared/components/Form/components';
import Button from '../../../shared/components/Button/ui/Button';

import { requestPasswordReset } from '../../../shared/api/user';
import { EROUTES } from '../../../shared/utils/ERoutes';
import {
	initialForgotPasswordValues,
	validationSchema,
	shouldBlockSubmit,
} from '../lib/helpers';

import styles from '../styles/forgot-password.module.scss';

const ForgotPasswordForm: FC = () => {
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);
	const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');

	const { values, handleChange, errors } = useForm<IForgotPasswordForm>(
		initialForgotPasswordValues,
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isBlockSubmit || isLoadingRequest) {
			return;
		}

		setIsLoadingRequest(true);
		setSuccessMessage('');
		setErrorMessage('');

		try {
			await requestPasswordReset(values.email);
			setSuccessMessage(
				'Письмо со ссылкой для сброса пароля отправлено. Проверьте почту.'
			);
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : 'Не удалось отправить письмо'
			);
		} finally {
			setIsLoadingRequest(false);
		}
	};

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	return (
		<Form name="form-forgot-password" onSubmit={handleSubmit}>
			<FormField
				title="Email"
				fieldError={{
					text: errors.email || '',
					isShow: !!errors.email,
				}}
			>
				<FormInput
					type="email"
					name="email"
					placeholder="Введите email"
					value={values.email}
					onChange={handleChange}
					autoComplete="email"
				/>
			</FormField>

			{successMessage && <p className={styles.success}>{successMessage}</p>}
			{errorMessage && <p className={styles.error}>{errorMessage}</p>}

			<FormButtons>
				<Button
					type="submit"
					text="Отправить ссылку"
					color="gradient"
					isBlock={isBlockSubmit || isLoadingRequest}
				/>
			</FormButtons>

			<FormLinks
				links={[
					{
						label: '',
						text: 'Вернуться ко входу',
						url: EROUTES.LOGIN,
					},
				]}
			/>
		</Form>
	);
};

export default ForgotPasswordForm;
