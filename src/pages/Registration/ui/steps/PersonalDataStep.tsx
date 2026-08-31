import type { FC, ChangeEvent } from 'react';
import type { IRegistrationFormValues } from '../../interface/interface';
import type { TFormValidationErrors } from '../../../../shared/components/Form/types/types';

import { FormField, FormInput } from '../../../../shared/components/Form/components';
import Button from '../../../../shared/components/Button/ui/Button';

import styles from '../../styles/registration.module.scss';

interface IPersonalDataStepProps {
  values: IRegistrationFormValues;
  errors: TFormValidationErrors;
  isNextBlocked: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onNext: () => void;
}

const PersonalDataStep: FC<IPersonalDataStepProps> = ({
  values,
  errors,
  isNextBlocked,
  onChange,
  onNext,
}) => {
  return (
    <div>
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>Личные данные</h2>
        <div className={styles.stepNumber}>01</div>
      </div>
      <p className={styles.contentSubtitle}>
        Укажите основную информацию о себе для регистрации и дальнейшей
        идентификации участника.
      </p>

      <div className={styles.row}>
        <FormField
          title="Фамилия"
          fieldError={{
            text: errors.last_name || '',
            isShow: !!errors.last_name,
          }}
        >
          <FormInput
            name="last_name"
            placeholder="Введите фамилию"
            value={values.last_name}
            onChange={onChange}
            hasError={!!errors.last_name}
          />
        </FormField>
        <FormField
          title="Имя"
          fieldError={{
            text: errors.first_name || '',
            isShow: !!errors.first_name,
          }}
        >
          <FormInput
            name="first_name"
            placeholder="Введите имя"
            value={values.first_name}
            onChange={onChange}
            hasError={!!errors.first_name}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField
          title="Отчество (при наличии)"
          fieldError={{
            text: errors.middle_name || '',
            isShow: !!errors.middle_name,
          }}
        >
          <FormInput
            name="middle_name"
            placeholder="Введите отчество"
            value={values.middle_name}
            onChange={onChange}
            hasError={!!errors.middle_name}
          />
        </FormField>
        <FormField
          title="Телефон"
          fieldError={{
            text: errors.phone_number || '',
            isShow: !!errors.phone_number,
          }}
        >
          <FormInput
            name="phone_number"
            placeholder="+7"
            value={values.phone_number}
            onChange={onChange}
            hasError={!!errors.phone_number}
          />
        </FormField>
      </div>

      <FormField
        title="Введите электронную почту"
        caption="На указанный e-mail будут направляться уведомления, результаты отбора и информация о финале конкурса"
        fieldError={{
          text: errors.email || '',
          isShow: !!errors.email,
        }}
      >
        <FormInput
          type="email"
          name="email"
          placeholder="Введите e-mail"
          value={values.email}
          onChange={onChange}
          hasError={!!errors.email}
        />
      </FormField>

      <div className={styles.actions}>
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

export default PersonalDataStep;
