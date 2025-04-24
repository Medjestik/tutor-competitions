import type { FC } from 'react';
import type { IFormInputString } from '../../../interface/interface';

import '../styles/style.css';

const FormInputString: FC<IFormInputString> = ({ value, placeholder, onChange, error }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      <input placeholder={placeholder} className='form__input' value={value} onChange={handleChange}></input>
      {
        error &&
        <span className={`form__input-error ${error.isShow ? 'form__input-error_type_show' : 'form__input-error_type_hide'}`}>{error.text}</span>
      }
      
    </>
  );
};

export default FormInputString;
