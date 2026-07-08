import type { FC } from 'react';
import type { ICardProps } from '../types/types';

import styles from '../styles/card.module.scss';

export const Card: FC<ICardProps> = ({
	title,
	titleSize = 'default',
	subtitle,
	id,
	width = 'full',
	withBackground = true,
	children,
}) => {
	return (
		<div
			id={id}
			className={`${styles.card} ${
				withBackground ? styles.card_background : ''
			} ${styles[`card_width_${width}`]}`}>
			{title && (
				<h2 className={`${styles.title} ${styles[`title_size_${titleSize}`]}`}>
					{title}
				</h2>
			)}
			{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
			{children}
		</div>
	);
};
