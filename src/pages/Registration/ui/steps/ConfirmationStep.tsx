import type { FC } from 'react';
import type { IRegistrationFormValues } from '../../interface/interface';

import Button from '../../../../shared/components/Button/ui/Button';

import styles from '../../styles/registration.module.scss';

interface IConfirmationStepProps {
  values: IRegistrationFormValues;
  isSubmitBlocked: boolean;
  isLoading: boolean;
  onToggleConsent: (name: keyof IRegistrationFormValues) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const CONSENT_ITEMS: Array<{
  name: keyof IRegistrationFormValues;
  label: string;
  section: 'personal' | 'competition';
}> = [
  {
    name: 'consent_personal_data',
    label: 'Выражаю согласие на обработку своих персональных данных.',
    section: 'personal',
  },
  {
    name: 'consent_personal_data_policy',
    label:
      'Подтверждаю, что ознакомился(-ась) с Положением об обработке персональных данных РУТ (МИИТ).',
    section: 'personal',
  },
  {
    name: 'consent_personal_data_spread',
    label:
      'Выражаю согласие на распространение персональных данных в целях освещения конкурса.',
    section: 'competition',
  },
  {
    name: 'consent_competition_rules',
    label:
      'Подтверждаю, что ознакомился(-ась) с условиями участия, изложенными в Положении и Регламенте.',
    section: 'competition',
  },
];

const ConfirmationStep: FC<IConfirmationStepProps> = ({
  values,
  isSubmitBlocked,
  isLoading,
  onToggleConsent,
  onBack,
  onSubmit,
}) => {
  const personalConsents = CONSENT_ITEMS.filter(
    (item) => item.section === 'personal'
  );
  const competitionConsents = CONSENT_ITEMS.filter(
    (item) => item.section === 'competition'
  );

  const renderConsent = (item: (typeof CONSENT_ITEMS)[number]) => {
    const checked = Boolean(values[item.name]);
    return (
      <div
        key={item.name}
        className={styles.consent}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onToggleConsent(item.name)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggleConsent(item.name);
          }
        }}
      >
        <div
          className={`${styles.consentBox} ${
            checked ? styles.consentBoxChecked : ''
          }`}
        />
        <p className={styles.consentLabel}>{item.label}</p>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>Подтверждение данных</h2>
        <div className={styles.stepNumber}>04</div>
      </div>
      <p className={styles.contentSubtitle}>
        Ознакомьтесь с документами конкурса и подтвердите согласие на обработку
        персональных данных.
      </p>

      <p className={styles.sectionTitle}>Персональные данные</p>
      <div className={styles.consents}>{personalConsents.map(renderConsent)}</div>

      <p className={styles.sectionTitle}>Участие в конкурсе</p>
      <div className={styles.consents}>
        {competitionConsents.map(renderConsent)}
      </div>

      <div className={styles.actions}>
        <Button text="Назад" color="inherit" onClick={onBack} />
        <Button
          text="Зарегистрироваться"
          color="gradient"
          onClick={onSubmit}
          isBlock={isSubmitBlocked || isLoading}
        />
      </div>
    </div>
  );
};

export default ConfirmationStep;
