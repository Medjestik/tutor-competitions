import { FC } from 'react';
import type { IFormInputStubProps } from '../../types/types';

import styles from './form-input.module.scss';

export const FormInputStub: FC<IFormInputStubProps> = ({ value }) => {
	return <div className={styles.stub}>{value}</div>;
};
