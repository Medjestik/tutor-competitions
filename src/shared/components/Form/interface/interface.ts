import type { FormEvent, PropsWithChildren } from 'react';

export interface IForm extends PropsWithChildren {
  formName: string;
  type?: 'page' | 'popup';
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export interface IFormField extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  marginBottom?:'default' | 'large';
}

export interface IFormInputString {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  error?: IFormFieldError;
}

export interface IFormFieldError {
  isShow: boolean;
  text: string;
}

export interface IFormSubmit {
  text: string;
  isLoading?: boolean;
  loadingText?: string;
  isShowError?: IFormFieldError;
  isBlock?: boolean;
}

export interface IFormError {
  text: string;
  isShow: boolean;
}

