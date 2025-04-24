import type { FC } from 'react';
import type { IFormField } from '../../../interface/interface';

import '../styles/style.css';

const FormField: FC<IFormField> = ({ title, subtitle, marginBottom = 'default', children }) => {

  return (
    <div className={`form__field form__field_margin-bottom_${marginBottom}`}>
      {title && <h3 className='form__field-title'>{title}</h3>}
      {subtitle && <p className='form__field-subtitle'>{subtitle}</p>}
      {children}  
    </div>
  );
};

export default FormField;
