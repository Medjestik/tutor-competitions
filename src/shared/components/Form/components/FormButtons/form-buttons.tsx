import type { FC } from 'react';
import type { IFormButtonsProps } from '../../types/types';

import styles from './form-buttons.module.scss';

export const FormButtons: FC<IFormButtonsProps> = ({
	children,
	withMargin = false,
}) => {
	return (
		<div
			className={`${styles.container} ${
				withMargin ? styles.container_margin_top : ''
			}`}>
			{children}
		</div>
	);
};
