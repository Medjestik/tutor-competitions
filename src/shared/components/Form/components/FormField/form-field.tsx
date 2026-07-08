import type { FC } from 'react';
import type { IFormFieldProps } from '../../types/types';

import { Tooltip } from '../../../Tooltip/ui/tooltip';

import styles from './form-field.module.scss';

export const FormField: FC<IFormFieldProps> = ({
	title,
	caption = '',
	fieldError,
	withInfo = false,
	withMarginBottom = false,
	infoText,
	children,
}) => {
	return (
		<div
			className={`${styles.container} ${
				withMarginBottom ? styles.container_margin_bottom : ''
			}`}>
			<div className={styles.header}>
				<h4 className={styles.title}>{title}</h4>
				{withInfo && (
					<Tooltip content={<p className={styles.tooltip__text}>{infoText}</p>}>
						<div className={styles.tooltip__icon}></div>
					</Tooltip>
				)}
			</div>
			{children}
			{fieldError && fieldError.isShow ? (
				<span
					className={`${styles.error} ${
						fieldError.isShow ? styles['error_status_show'] : ''
					}`}>
					{fieldError.text}
				</span>
			) : (
				<span className={styles.caption}>{caption}</span>
			)}
		</div>
	);
};
