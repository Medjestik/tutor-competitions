import type { FC } from 'react';
import type { IForm } from '../interface/interface';

import '../styles/style.css';

const Form: FC<IForm> = ({ formName, onSubmit, type = 'page', children }) => {
  return (
    <form 
      className={`form form_type_${type}`} 
      name={formName}
      onSubmit={onSubmit}
      action='#'
      noValidate 
    >
      {children}
    </form>
  );
};

export default Form;
