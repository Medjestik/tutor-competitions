import type { FC } from 'react';
import type { IFormFieldButton } from '../../../interface/interface';

import '../styles/style.css';

const FormFieldButton: FC<IFormFieldButton> = ({ text = 'Сохранить', onClick, isBlock = false }) => {
  return (
    <button className={`form__input-btn ${isBlock ? 'form__input-btn_type_block' : ''}`} onClick={onClick} type='button'>{text}</button>
  );
};

export default FormFieldButton;
