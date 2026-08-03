import type { FC } from 'react';
import type { IButtonProps } from '../types/types';
import styles from '../styles/button.module.scss';

const Button: FC<IButtonProps> = ({
	type = 'button',
	width = 'default',
	color = 'default',
	style,
	form,
	isBlock = false,
	text,
	onClick,
	href = '/',
	withIcon,
	disabled = false,
}) => {
	const baseClass = `${styles.button} ${styles[`button_width_${width}`]} ${
		styles[`button_color_${color}`]
	} ${isBlock || disabled ? styles.button_block : ''}`;

	const renderContent = () => (
		<>
			{withIcon && withIcon.position !== 'right' && (
				<span
					className={`${styles.icon} ${
						styles[
							`icon_${withIcon.type}_${
								withIcon.color ? withIcon.color : 'white'
							}`
						]
					}`}
				/>
			)}
			{text}
			{withIcon && withIcon.position === 'right' && (
				<span
					className={`${styles.icon} ${
						styles[
							`icon_${withIcon.type}_${
								withIcon.color ? withIcon.color : 'white'
							}`
						]
					}`}
				/>
			)}
		</>
	);

	if (isBlock) {
		return (
			<div style={style} className={baseClass}>
				{renderContent()}
			</div>
		);
	}

	if (type === 'link') {
		return (
			<a
				href={href}
				className={baseClass}
				target='_blank'
				rel='noreferrer'
				style={style}>
				{renderContent()}
			</a>
		);
	}

	return (
		<button
			type={type}
			onClick={onClick}
			form={form}
			className={baseClass}
			style={style}
			disabled={disabled || isBlock}>
			{renderContent()}
		</button>
	);
};

export default Button;
