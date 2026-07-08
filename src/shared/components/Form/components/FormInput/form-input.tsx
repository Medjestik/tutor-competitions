import { FC, useState } from 'react';
import type { IFormInputProps } from '../../types/types';

import styles from './form-input.module.scss';

export const FormInput: FC<IFormInputProps> = ({
	type = 'text',
	name,
	placeholder = 'Введите значение…',
	value,
	autoComplete = 'off',
	onChange,
	disabled = false,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = type === 'password';
	const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

	return (
		<div className={styles.wrapper}>
			<input
				className={`${styles.input} ${disabled ? styles.disabled : ''}`}
				type={inputType}
				name={name}
				id={`id-${name}`}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				autoComplete={autoComplete}
				disabled={disabled}
			/>

			{isPassword && (
				<button
					type='button'
					className={`${styles.toggle} ${showPassword ? styles.active : ''}`}
					onClick={() => setShowPassword((p) => !p)}
				/>
			)}
		</div>
	);
};
