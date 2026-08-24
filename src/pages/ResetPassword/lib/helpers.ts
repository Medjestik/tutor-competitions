import type { IResetPasswordForm } from '../interface/interface';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import {
	required,
	minLength,
	maxLength,
} from '../../../shared/lib/validationRules';

export const validationSchema = {
	new_password: [
		required('Поле обязательно'),
		minLength(6, 'Минимум 6 символов'),
		maxLength(16, 'Максимум 16 символов'),
	],
	confirm_password: [
		required('Поле обязательно'),
		minLength(6, 'Минимум 6 символов'),
		maxLength(16, 'Максимум 16 символов'),
	],
};

export const initialResetPasswordValues: IResetPasswordForm = {
	new_password: '',
	confirm_password: '',
};

export const shouldBlockSubmit = (
	values: IResetPasswordForm,
	errors: TFormValidationErrors
): boolean => {
	return (
		!values.new_password.trim() ||
		!!errors.new_password ||
		!values.confirm_password.trim() ||
		!!errors.confirm_password ||
		values.new_password !== values.confirm_password
	);
};
