import type { ReactNode, FormEventHandler, ChangeEvent } from 'react';

export interface IFormProps {
	title?: string;
	subtitle?: string;
	titleAlign?: 'center' | 'left';
	formWidth?: 'full' | 'large' | 'default' | 'small';
	direction?: 'column' | 'row';
	withHeightStretch?: boolean;
	name: string;
	autoComplete?: string;
	onSubmit?: FormEventHandler<HTMLFormElement>;
	children?: ReactNode;
}

export interface IFormFieldProps {
	title?: string;
	caption?: string;
	withInfo?: boolean;
	withMarginBottom?: boolean;
	onInfo?: () => void;
	infoText?: string;
	fieldError?: IFormFieldError;
	children?: ReactNode;
}

export interface IFormFieldError {
	text: string;
	isShow: boolean;
}

export interface IFormInputProps {
	type?: 'text' | 'number' | 'password';
	name: string;
	placeholder?: string;
	value: string;
	autoComplete?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
}

export interface IFormInputStubProps {
	value: string;
}

export interface IFormInputNumberProps {
	type?: 'number';
	name: string;
	placeholder?: string;
	value: number | null;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface IFormTextareaProps {
	name: string;
	placeholder?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface IFormButtonsProps {
	children?: ReactNode;
	withMargin?: boolean;
}

export interface IFormLink {
	text: string;
	label: string;
	url: string;
}

export interface IFormLinksProps {
	links: IFormLink[];
}

export type TFormValidationErrors = Record<string, string | undefined>;
