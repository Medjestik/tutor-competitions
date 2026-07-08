/* eslint-disable @typescript-eslint/naming-convention */
import { useState, ChangeEvent, useCallback } from 'react';

interface IValidationRule {
	validate: (value: string) => boolean;
	errorMessage: string;
}

type TValidationSchema<T> = {
	[K in keyof T]?: IValidationRule[];
};

export function useForm<T>(
	initialValues: T,
	validationSchema: TValidationSchema<T>
) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});

	const validateField = useCallback(
		(name: keyof T, value: string) => {
			const fieldRules = validationSchema[name];
			if (!fieldRules) return;

			for (const rule of fieldRules) {
				if (!rule.validate(value)) {
					setErrors((prevErrors) => ({
						...prevErrors,
						[name]: rule.errorMessage,
					}));
					return;
				}
			}
			setErrors((prevErrors) => ({
				...prevErrors,
				[name]: '',
			}));
		},
		[validationSchema]
	);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));

		validateField(name as keyof T, value);
	};

	const handleSelectChange = <K extends keyof T>(name: K, value: T[K]) => {
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxToggle = <K extends keyof T>(name: K) => {
		setValues((prevValues) => ({
			...prevValues,
			[name]: !prevValues[name],
		}));
	};

	const setFieldValue = <K extends keyof T>(name: K, value: string) => {
		setValues((prev) => ({
			...prev,
			[name]: value,
		}));

		validateField(name, value);
	};

	return {
		values,
		handleChange,
		handleSelectChange,
		handleCheckboxToggle,
		setValues,
		setFieldValue,
		errors,
	};
}
