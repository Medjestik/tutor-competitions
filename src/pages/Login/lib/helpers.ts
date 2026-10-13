import type { ILoginForm } from '../interface/interface';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import { required } from '../../../shared/lib/validationRules';

export const validationSchema = {
	login: [
		required('Поле обязательно'),
	],
	password: [
		required('Поле обязательно'),
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
