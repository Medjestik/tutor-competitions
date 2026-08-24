import type { IForgotPasswordForm } from '../interface/interface';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import {
	required,
	emailFormat,
} from '../../../shared/lib/validationRules';

export const validationSchema = {
	email: [required('Поле обязательно'), emailFormat()],
};

export const initialForgotPasswordValues: IForgotPasswordForm = {
	email: '',
};

export const shouldBlockSubmit = (
	values: IForgotPasswordForm,
	errors: TFormValidationErrors
): boolean => {
	return !values.email.trim() || !!errors.email;
};
