import type { FC, FormEvent } from 'react';
import type { ILoginForm, ILoginData } from '../interface/interface';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useForm } from '../../../shared/hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Form } from '../../../shared/components/Form/ui/Form';
import { FormField, FormButtons, FormInput } from '../../../shared/components/Form/components';
import Button from '../../../shared/components/Button/ui/Button';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { initialLoginValues, validationSchema, shouldBlockSubmit } from '../lib/helpers';
import { loginUser } from '../../../store/user/actions';

const LoginForm: FC = () => {
  const dispatch = useDispatch();
	const { showToast } = useToast();
	const { isLoading } = useSelector((state) => state.user);
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);

	const { values, handleChange, errors } = useForm<ILoginForm>(
		initialLoginValues,
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
    if (!isBlockSubmit) {
      const data: ILoginData = { username: values.login, password: values.password };
			try {
				await dispatch(loginUser(data)).unwrap();
			} catch (err) {
				console.error(err);
				showToast({
					title: 'Ошибка при авторизации',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

  return (
    <Form name="form-login" onSubmit={handleSubmit}>
      <FormField
        title="Логин"
        fieldError={{
          text: errors.login || '',
          isShow: !!errors.login,
        }}
      >
        <FormInput
          name="login"
          placeholder="Введите логин"
          value={values.login}
          onChange={handleChange}
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
          isBlock={isBlockSubmit || isLoading}
        />
      </FormButtons>
    </Form>
  );
};

export default LoginForm; 
