import type { FC } from 'react';
import type { IFormFieldError } from '../../../interface/interface';

import '../styles/style.css';

const FormFieldError: FC<IFormFieldError> = ({ isShow, text, type = 'error' }) => {
  return (
    <>
      <span className={`form__input-error ${isShow ? 'form__input-error_type_show' : 'form__input-error_type_hide'} form__input-error_type_${type}`}>{text}</span>
    </>
  );
};

export default FormFieldError;
