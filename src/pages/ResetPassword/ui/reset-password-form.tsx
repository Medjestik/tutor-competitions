import type { FC, FormEvent } from 'react';
import type { IResetPasswordForm } from '../interface/interface';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../../shared/hooks/useForm';

import { Form } from '../../../shared/components/Form/ui/Form';
import {
	FormField,
	FormButtons,
	FormInput,
	FormLinks,
} from '../../../shared/components/Form/components';
import Button from '../../../shared/components/Button/ui/Button';

import { confirmPasswordReset } from '../../../shared/api/user';
import { EROUTES } from '../../../shared/utils/ERoutes';
import {
	initialResetPasswordValues,
	validationSchema,
	shouldBlockSubmit,
} from '../lib/helpers';

import styles from '../styles/reset-password.module.scss';

const ResetPasswordForm: FC = () => {
	const navigate = useNavigate();
	const { uid, token } = useParams<{ uid: string; token: string }>();

	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);
	const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [mismatchError, setMismatchError] = useState<string>('');

	const { values, handleChange, errors } = useForm<IResetPasswordForm>(
		initialResetPasswordValues,
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isBlockSubmit || isLoadingRequest || !uid || !token) {
			if (!uid || !token) {
				setErrorMessage('Ссылка недействительна или истекла');
			}
			return;
		}

		if (values.new_password !== values.confirm_password) {
			setMismatchError('Пароли не совпадают');
			return;
		}

		setIsLoadingRequest(true);
		setSuccessMessage('');
		setErrorMessage('');
		setMismatchError('');

		try {
			await confirmPasswordReset({
				uidb64: uid,
				token,
				new_password: values.new_password,
			});
			setSuccessMessage('Пароль успешно изменён. Сейчас вы перейдёте ко входу.');
			window.setTimeout(() => {
				navigate(EROUTES.LOGIN);
			}, 1500);
		} catch {
			setErrorMessage('Ссылка недействительна или истекла');
		} finally {
			setIsLoadingRequest(false);
		}
	};

	useEffect(() => {
		if (
			values.confirm_password &&
			values.new_password !== values.confirm_password
		) {
			setMismatchError('Пароли не совпадают');
		} else {
			setMismatchError('');
		}
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	return (
		<Form name="form-reset-password" onSubmit={handleSubmit}>
			<FormField
				title="Новый пароль"
				fieldError={{
					text: errors.new_password || '',
					isShow: !!errors.new_password,
				}}
			>
				<FormInput
					type="password"
					name="new_password"
					placeholder="Введите новый пароль"
					value={values.new_password}
					onChange={handleChange}
					autoComplete="new-password"
				/>
			</FormField>

			<FormField
				title="Повторите пароль"
				fieldError={{
					text: mismatchError || errors.confirm_password || '',
					isShow: !!mismatchError || !!errors.confirm_password,
				}}
			>
				<FormInput
					type="password"
					name="confirm_password"
					placeholder="Повторите новый пароль"
					value={values.confirm_password}
					onChange={handleChange}
					autoComplete="new-password"
				/>
			</FormField>

			{successMessage && <p className={styles.success}>{successMessage}</p>}
			{errorMessage && <p className={styles.error}>{errorMessage}</p>}

			<FormButtons>
				<Button
					type="submit"
					text="Сохранить новый пароль"
					color="gradient"
					isBlock={isBlockSubmit || isLoadingRequest || !uid || !token}
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

export default ResetPasswordForm;
