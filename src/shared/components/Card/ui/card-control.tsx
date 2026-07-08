import type { FC } from 'react';
import type { ICardControlProps } from '../types/types';

import styles from '../styles/card.module.scss';

export const CardControl: FC<ICardControlProps> = ({ children }) => {
	return <div className={styles.control}>{children}</div>;
};
