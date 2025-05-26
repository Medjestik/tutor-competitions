import type { FC } from 'react';
import type { IFormInputString } from '../../../interface/interface';

import '../../../styles/style.css';

const FormTextArea: FC<IFormInputString> = (
  { 
    value, 
    placeholder, 
    onChange, 
  }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      placeholder={placeholder}
      className='form__textarea'
      value={value}
      onChange={handleChange}
      rows={6}
      
    />
  );
};

export default FormTextArea;
