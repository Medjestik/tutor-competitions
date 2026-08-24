import type { FC, FormEvent } from 'react';
import type { ILoginForm, ILoginData } from '../interface/interface';
import type { IFormError } from '../../../shared/components/Form/types/types';

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from '../../../shared/hooks/useForm';

import { Form } from '../../../shared/components/Form/ui/Form';
import { FormField, FormInput } from '../../../shared/components/Form/components';
import Button from '../../../shared/components/Button/ui/Button';
import { EROUTES } from '../../../shared/utils/ERoutes';

import { getSettings } from '../../../shared/api/settings';
import { initialLoginValues, validationSchema, shouldBlockSubmit } from '../lib/helpers';
import styles from '../styles/login.module.scss';

interface ILoginFormProps {
	onLogin: (data: ILoginData) => void;
	loginError: IFormError;
	isLoadingRequest: boolean;
}

const LoginForm: FC<ILoginFormProps> = ({ onLogin, loginError, isLoadingRequest }) => {
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);
	const [canLogin, setCanLogin] = useState<boolean>(true);
	const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true);

	const { values, handleChange, errors } = useForm<ILoginForm>(
		initialLoginValues,
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!canLogin || isBlockSubmit || isLoadingRequest || isLoadingSettings) {
			return;
		}
		const data: ILoginData = { username: values.login, password: values.password };
		onLogin(data);
	};

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	useEffect(() => {
		setIsLoadingSettings(true);
		getSettings()
			.then((settings) => {
				setCanLogin(settings.can_login !== false);
			})
			.catch((err) => {
				console.error(err);
				setCanLogin(true);
			})
			.finally(() => setIsLoadingSettings(false));
	}, []);

	return (
		<Form name="form-login" onSubmit={handleSubmit}>
			<FormField
				title="Логин"
				fieldError={{
					text: errors.login || '',
					isShow: !!errors.login,
				}}
			>
				<FormInput
					name="login"
					placeholder="Введите логин"
					value={values.login}
					onChange={handleChange}
				/>
			</FormField>

			<FormField
				title="Пароль"
				fieldError={{
					text: errors.password || '',
					isShow: !!errors.password,
				}}
			>
				<FormInput
					type="password"
					name="password"
					placeholder="Введите пароль"
					value={values.password}
					onChange={handleChange}
					autoComplete="on"
				/>
			</FormField>

			{loginError.isShow && (
				<p style={{ color: '#c62828', margin: '0 0 12px' }}>{loginError.text}</p>
			)}

			{!canLogin && !isLoadingSettings && (
				<p style={{ color: '#c62828', margin: '0 0 12px' }}>
					Вход в личный кабинет временно закрыт
				</p>
			)}

			<div className={styles.formActions}>
				<Button
					type="submit"
					text="Войти в личный кабинет"
					color="gradient"
					isBlock={
						!canLogin || isBlockSubmit || isLoadingRequest || isLoadingSettings
					}
				/>
				<NavLink className={styles.forgotLink} to={EROUTES.FORGOT_PASSWORD}>
					Забыли пароль?
				</NavLink>
			</div>
		</Form>
	);
};

export default LoginForm;
