import type { FC, FormEvent } from 'react';
import type { ILoginForm, ILoginData } from '../interface/interface';

import { useState, useEffect } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';
import { useDispatch, useSelector } from '../../../store/store';

import { Form } from '../../../shared/components/Form/ui/form';
import {
  FormField,
  FormButtons,
  FormInput,
} from '../../../shared/components/Form/components';
import Button from '../../../shared/components/Button/ui/Button';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import {
  initialLoginValues,
  validationSchema,
  shouldBlockSubmit,
} from '../lib/helpers';
import { loginUser } from '../../../store/user/actions';

const LoginForm: FC = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const {
    settings,
    isLoading,
  } = useSelector((state) => state.user);

  const [isBlockSubmit, setIsBlockSubmit] = useState(true);

  const { values, handleChange, errors } = useForm<ILoginForm>(
    initialLoginValues,
    validationSchema
  );

  useEffect(() => {
    setIsBlockSubmit(shouldBlockSubmit(values, errors));
  }, [values, errors]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (settings?.can_login === false) {
      showToast({
        title: 'Ошибка при авторизации!',
        text: 'Вход в личный кабинет временно закрыт',
        type: 'error',
      });
      return;
    }

    if (isBlockSubmit || isLoading) {
      return;
    }

    const data: ILoginData = {
      login: values.login.trim(),
      password: values.password,
    };

    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (err) {
      showToast({
        title: 'Ошибка при авторизации!',
        text: getErrorMessage(err),
        type: 'error',
      });
    }
  };

  return (
    <Form name="form-login" onSubmit={handleSubmit}>
      <FormField
        title="Email или логин"
        fieldError={{
          text: errors.login || '',
          isShow: !!errors.login,
        }}
      >
        <FormInput
          type="text"
          name="login"
          placeholder="Введите email или логин"
          value={values.login}
          onChange={handleChange}
          autoComplete="username"
        />
      </FormField>

      <FormField
        title="Пароль"
        fieldError={{
          text: errors.password || '',
          isShow: !!errors.password,
        }}
      >
        <FormInput
          type="password"
          name="password"
          placeholder="Введите пароль"
          value={values.password}
          onChange={handleChange}
          autoComplete="on"
        />
      </FormField>

      <FormButtons>
        <Button
          type="submit"
          text="Войти в личный кабинет"
          color="gradient"
          isBlock={settings?.can_login === false || isBlockSubmit || isLoading}
        />
      </FormButtons>
    </Form>
  );
};

export default LoginForm;
