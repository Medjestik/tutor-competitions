import type { FC } from 'react';
import type { IFormSubmit } from '../../../interface/interface';

import '../styles/style.css';

const FormSubmit: FC<IFormSubmit> = ({ text, isBlock, loadingText, isLoading }) => {

  if (isBlock) {
    return (
      <div className='form__submit form__submit_type_block'>
      {text || ''}
    </div>
    );
  }

  if (isLoading) {
    return (
      <div className='form__submit form__submit_type_block'>
      {loadingText || ''}
    </div>
    );
  }

  return (
    <>
      <button className='form__submit' type='submit'>
        {text || ''}
      </button>
    </>
  );
};

export default FormSubmit;
