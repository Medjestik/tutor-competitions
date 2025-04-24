import type { FC } from 'react';
import type { IFormError } from '../../../interface/interface';

import '../styles/style.css';

const FormError: FC<IFormError> = ({ text, isShow}) => {

  return (
    <p className={`form__error ${isShow ? 'form__error_status_show' : ''}`}>{text}</p>
  );
};

export default FormError;
