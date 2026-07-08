import type { ILoginForm } from '../interface/interface';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import {
	required,
	minLength,
	maxLength,
} from '../../../shared/lib/validationRules';

export const validationSchema = {
	login: [
		required('Поле обязательно'),
		minLength(6, 'Минимум 6 символов'),
		maxLength(16, 'Максимум 16 символов'),
	],
	password: [
		required('Поле обязательно'),
		minLength(6, 'Минимум 6 символов'),
		maxLength(16, 'Максимум 16 символов'),
	],
};

export const initialLoginValues: ILoginForm = {
	login: '',
	password: '',
};

export const shouldBlockSubmit = (
	values: ILoginForm,
	errors: TFormValidationErrors
): boolean => {
	return (
		!values.login.trim() ||
		!!errors.login ||
		!values.password.trim() ||
		!!errors.password
	);
};
