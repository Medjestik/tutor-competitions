import { useState } from 'react';
import type { IFormFieldError } from '../components/Form/interface/interface'; 

export const useFormInput = (
  initialValue = '',
  apiSaveFn?: (token: string, value: string) => Promise<unknown>,
  maxLength = 2000
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<IFormFieldError>({ isShow: false, text: '', type: 'error' });
  const [isBlocked, setIsBlocked] = useState(true);

  const clearError = () => {
    setError({ isShow: false, text: '', type: 'error' });
  };

  const handleChange = (val: string) => {
    clearError();
    if (val.length === 0) {
      setValue(val);
      setError({ isShow: true, text: 'Поле не может быть пустым', type: 'error' });
      setIsBlocked(true);
    } else if (val.length > maxLength) {
      setError({ isShow: true, text: `Максимальная длина — ${maxLength} символов`, type: 'error' });
      setIsBlocked(true);
    } else {
      setValue(val);
      setIsBlocked(false);
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (token && apiSaveFn) {
      apiSaveFn(token, value)
        .then(() => {
          setError({ isShow: true, text: 'Данные успешно сохранены!', type: 'success' });
          setIsBlocked(true);
          setTimeout(() => clearError(), 3000);
        })
        .catch(() => {
          setError({ isShow: true, text: 'При сохранении произошла ошибка!', type: 'error' });
          setTimeout(() => clearError(), 3000);
        });
    }
  };

  return {
    value,
    setValue,
    handleChange,
    handleSave,
    error,
    isBlocked,
    clearError,
  };
};
