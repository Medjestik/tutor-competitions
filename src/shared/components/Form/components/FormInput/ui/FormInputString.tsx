import type { FC } from 'react';
import type { IFormInputString } from '../../../interface/interface';

import FormFieldError from '../../FormField/ui/FormFieldError';

import '../styles/style.css';

const FormInputString: FC<IFormInputString> = (
  { 
    value, 
    placeholder, 
    onChange, 
    error,
  }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      <input placeholder={placeholder} className='form__input' value={value} onChange={handleChange}></input>
      {
        error &&
        <FormFieldError isShow={error.isShow} text={error.text} />
      }
      
    </>
  );
};

export default FormInputString;
