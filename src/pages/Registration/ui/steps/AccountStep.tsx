import type { FC, ChangeEvent } from 'react';
import type { IRegistrationFormValues } from '../../interface/interface';
import type { TFormValidationErrors } from '../../../../shared/components/Form/types/types';

import { FormField, FormInput } from '../../../../shared/components/Form/components';
import Button from '../../../../shared/components/Button/ui/Button';

import styles from '../../styles/registration.module.scss';

interface IAccountStepProps {
  values: IRegistrationFormValues;
  errors: TFormValidationErrors;
  isNextBlocked: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onBack: () => void;
  onNext: () => void;
}

const AccountStep: FC<IAccountStepProps> = ({
  values,
  errors,
  isNextBlocked,
  onChange,
  onBack,
  onNext,
}) => {
  return (
    <div>
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>Личный кабинет</h2>
        <div className={styles.stepNumber}>03</div>
      </div>
      <p className={styles.contentSubtitle}>
        Создайте данные для входа, чтобы управлять заявкой и добавлять
        образовательные практики.
      </p>

      <FormField
        title="Логин"
        caption="Логин должен содержать от 6 до 16 символов"
        fieldError={{
          text: errors.username || '',
          isShow: !!errors.username,
        }}
      >
        <FormInput
          name="username"
          placeholder="Придумайте логин"
          value={values.username}
          onChange={onChange}
          hasError={!!errors.username}
          autoComplete="username"
        />
      </FormField>

      <FormField
        title="Пароль"
        caption="Пароль должен содержать минимум 8 символов"
        fieldError={{
          text: errors.password || '',
          isShow: !!errors.password,
        }}
      >
        <FormInput
          type="password"
          name="password"
          placeholder="Придумайте пароль"
          value={values.password}
          onChange={onChange}
          hasError={!!errors.password}
          autoComplete="new-password"
        />
      </FormField>

      <div className={styles.actions}>
        <Button text="Назад" color="inherit" onClick={onBack} />
        <Button
          text="Далее"
          color="gradient"
          onClick={onNext}
          isBlock={isNextBlocked}
        />
      </div>
    </div>
  );
};

export default AccountStep;
