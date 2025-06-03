import type { FC, FormEvent } from 'react';
import type { IFormFieldError, IFormError } from '../../../shared/components/Form/interface/interface';
import type { ILoginData } from '../interface/interface';

import { useState, useEffect } from 'react';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import Form from '../../../shared/components/Form/ui/Form';
import FormField from '../../../shared/components/Form/components/FormField/ui/FormField';
import FormInputString from '../../../shared/components/Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import Link from '../../../shared/components/Link/ui/Link';

import { EROUTES } from '../../../shared/utils/ERoutes';

import '../styles/style.css';

interface ILoginProps {
  windowWidth: number;
  onLogin: (data: ILoginData) => void;
  loginError: IFormError;
  isLoadingRequest: boolean;
}
const Login: FC<ILoginProps> = ({ windowWidth, onLogin, loginError, isLoadingRequest }) => {

  const [login, setLogin] = useState<string>('');
  const [isShowErrorLogin, setIsShowErrorLogin] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [password, setPassword] = useState<string>('');
  const [isShowErrorPassword, setIsShowErrorPassword] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(true);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      username: login,
      password: password,
    };
    onLogin(data);
  };

  const handleChangeLogin = (value: string) => {
    setLogin(value);
    setIsShowErrorLogin(value.length > 5 ? { isShow: false, text: '' } : { isShow: true, text: 'Логин должен содержать минимум 6 символов' });
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    setIsShowErrorPassword(value.length > 7 ? { isShow: false, text: '' } : { isShow: true, text: 'Пароль должен содержать минимум 8 символов' });
  };

  
  useEffect(() => {
  
    const isAnyFieldEmpty = (
      login.trim().length < 1 ||
      password.trim().length < 1
    );
  
    const hasAnyError = (
      isShowErrorLogin.isShow ||
      isShowErrorPassword.isShow
    );
  
    if (isAnyFieldEmpty || hasAnyError) {
      setIsBlockSubmitButton(true);
    } else {
      setIsBlockSubmitButton(false);
    }
  }, [
    login, password
  ]);

  return (
    <>
    <MainLayout windowWidth={windowWidth} isLoggedIn={false} >
      <h1 className='layout__title'>Вход в личный кабинет</h1>

      <Form formName={'registration-form'} onSubmit={onSubmit}>

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

        <FormSubmit text='Войти' isBlock={isBlockSubmitButton} isLoading={isLoadingRequest} loadingText='Вход..' /> 
        {loginError.isShow && <div>Ошибка входа</div>}
        <p className='login__caption'>У меня нет <Link text='логина и пароля' path={EROUTES.REGISTRATION} target={false}/></p>

      </Form>

    </MainLayout>
    </>
  );
};

export default Login; 
