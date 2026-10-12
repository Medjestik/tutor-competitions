import type { ILoginForm } from '../interface/interface';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import { required, emailFormat } from '../../../shared/lib/validationRules';

export const validationSchema = {
	email: [
		required('Поле обязательно'),
		emailFormat(),
	],
	password: [
		required('Поле обязательно'),
	],
};

export const initialLoginValues: ILoginForm = {
	email: '',
	password: '',
};

export const shouldBlockSubmit = (
	values: ILoginForm,
	errors: TFormValidationErrors
): boolean => {
	return (
		!values.email.trim() ||
		!!errors.email ||
		!values.password.trim() ||
		!!errors.password
	);
};
