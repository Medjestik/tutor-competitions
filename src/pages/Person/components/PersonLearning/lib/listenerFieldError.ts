import type {
  IListenerFieldError,
  IListenerFormState,
  TListenerFieldErrors,
} from '../interface/interface';

export const makeListenerFieldError = (
  fieldErrors: TListenerFieldErrors,
  key: keyof IListenerFormState
): IListenerFieldError => ({
  text: fieldErrors[key] ?? '',
  isShow: Boolean(fieldErrors[key]),
});

export const hasListenerFieldError = (
  fieldErrors: TListenerFieldErrors,
  key: keyof IListenerFormState
): boolean => Boolean(fieldErrors[key]);
