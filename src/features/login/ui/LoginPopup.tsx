import type { FC, FormEvent } from 'react';
import type { ILoginPopupProps } from '../interface/interface';
import type { IFormFieldError } from '../../../shared/components/Form/interface/interface';

import { useState, useEffect } from 'react';
import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';
import Form from '../../../shared/components/Form/ui/Form';
import FormField from '../../../shared/components/Form/components/FormField/ui/FormField';
import FormInputString from '../../../shared/components/Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import FormError from '../../../shared/components/Form/components/FormError/ui/FormError';

const LoginPopup: FC<ILoginPopupProps> = ({ isOpen, onClose, onSubmit, loginError, isLoadingRequest }) => {

  const [login, setLogin] = useState<string>('');
  const [isShowErrorLogin, setIsShowErrorLogin] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [password, setPassword] = useState<string>('');
  const [isShowErrorPassword, setIsShowErrorPassword] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(true);

  const btnStyle = {
    width: '100%',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const handleChangeLogin = (value: string) => {
    setLogin(value);
    setIsShowErrorLogin(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    setIsShowErrorPassword(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { login, password };
    onSubmit(data);
  };

  useEffect(() => {
    const isAnyFieldEmpty = login.length < 1 || password.length < 1;
    const hasAnyError = isShowErrorLogin.isShow || isShowErrorPassword.isShow;
  
    if (isAnyFieldEmpty || hasAnyError) {
      setIsBlockSubmitButton(true);
    } else {
      setIsBlockSubmitButton(false);
    }
  }, [login, password]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='large'>
      <h2 className='popup__title'>Вход в личный кабинет</h2>
      <Form formName='login' type='popup' onSubmit={handleSubmit}>
        <FormField title='Логин'>
          <FormInputString 
            value={login} 
            placeholder='Введите логин..' 
            onChange={handleChangeLogin} 
            error={isShowErrorLogin} 
          />
        </FormField>
        <FormField title='Пароль'>
          <FormInputString 
            value={password} 
            placeholder='Введите пароль..' 
            onChange={handleChangePassword} 
            error={isShowErrorPassword} 
          />
        </FormField>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Назад' color='cancel' onClick={onClose} />
          <FormSubmit text='Войти' isBlock={isBlockSubmitButton || isLoadingRequest} />
        </div>
        <FormError isShow={loginError.isShow} text={loginError.text} />
      </Form>
    </Popup>
  );
};

export default LoginPopup;
