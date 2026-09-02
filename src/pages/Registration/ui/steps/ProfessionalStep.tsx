import type { FC, ChangeEvent } from 'react';
import type { IRegistrationFormValues } from '../../interface/interface';
import type { TFormValidationErrors } from '../../../../shared/components/Form/types/types';
import type { ISelectOption } from '../../../../shared/components/Select/interface/interface';

import { FormField, FormInput } from '../../../../shared/components/Form/components';
import SelectWithSearch from '../../../../shared/components/Select/ui/SelectWithSearch';
import Button from '../../../../shared/components/Button/ui/Button';

import {
  ORGANIZATION_OPTIONS,
  ORGANIZATION_PLACEHOLDER,
  OTHER_ORGANIZATION,
} from '../../lib/organizations';

import styles from '../../styles/registration.module.scss';

interface IProfessionalStepProps {
  values: IRegistrationFormValues;
  errors: TFormValidationErrors;
  selectedOrganization: ISelectOption;
  isNextBlocked: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onChooseOrganization: (option: ISelectOption) => void;
  onBack: () => void;
  onNext: () => void;
}

const ProfessionalStep: FC<IProfessionalStepProps> = ({
  values,
  errors,
  selectedOrganization,
  isNextBlocked,
  onChange,
  onChooseOrganization,
  onBack,
  onNext,
}) => {
  const isOther = selectedOrganization.id === OTHER_ORGANIZATION.id;

  return (
    <div>
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>Профессиональная информация</h2>
        <div className={styles.stepNumber}>02</div>
      </div>
      <p className={styles.contentSubtitle}>
        Расскажите, какую образовательную организацию вы представляете и в какой
        роли участвуете в конкурсе.
      </p>

      <FormField
        title="Образовательная организация"
        caption='Если вашей организации нет в списке, выберите вариант «Другая организация»'
      >
        <div className={styles.selectWrap}>
          <SelectWithSearch
            options={ORGANIZATION_OPTIONS}
            currentOption={selectedOrganization}
            onChooseOption={onChooseOrganization}
          />
        </div>
        {selectedOrganization.id === ORGANIZATION_PLACEHOLDER.id && (
          <p className={styles.fieldHint}>Выберите организацию из списка</p>
        )}
      </FormField>

      {isOther && (
        <FormField
          title="Другая организация"
          fieldError={{
            text: errors.other_organization || '',
            isShow: !!errors.other_organization,
          }}
        >
          <FormInput
            name="other_organization"
            placeholder="Введите название организации"
            value={values.other_organization}
            onChange={onChange}
            hasError={!!errors.other_organization}
          />
        </FormField>
      )}

      <FormField
        title="Основная должность"
        fieldError={{
          text: errors.main_position || '',
          isShow: !!errors.main_position,
        }}
      >
        <FormInput
          name="main_position"
          placeholder="Введите должность"
          value={values.main_position}
          onChange={onChange}
          hasError={!!errors.main_position}
        />
      </FormField>

      <div className={styles.actions}>
        <Button text="Назад" onClick={onBack} />
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

export default ProfessionalStep;
