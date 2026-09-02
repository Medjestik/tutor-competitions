import type { FC, ReactNode } from 'react';
import type { IRegistrationFormValues } from '../../interface/interface';

import Button from '../../../../shared/components/Button/ui/Button';
import { EROUTES } from '../../../../shared/utils/ERoutes';
import {
  ORDER_LINK,
  PERSONAL_DATA_POLICY_LINK,
  REGULATION_LINK,
} from '../../../../shared/lib/lib';

import styles from '../../styles/registration.module.scss';

interface IConfirmationStepProps {
  values: IRegistrationFormValues;
  isSubmitBlocked: boolean;
  isLoading: boolean;
  onToggleConsent: (name: keyof IRegistrationFormValues) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ConsentLink: FC<{ href: string; children: ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={styles.consentLink}
    onClick={(event) => event.stopPropagation()}
  >
    {children}
  </a>
);

const CONSENT_ITEMS: Array<{
  name: keyof IRegistrationFormValues;
  label: ReactNode;
  section: 'personal' | 'competition';
}> = [
  {
    name: 'consent_personal_data',
    label: (
      <>
        Выражаю{' '}
        <ConsentLink href={EROUTES.CONSENT}>
          согласие на обработку своих персональных данных
        </ConsentLink>
        .
      </>
    ),
    section: 'personal',
  },
  {
    name: 'consent_personal_data_policy',
    label: (
      <>
        Подтверждаю, что ознакомился(-ась) с{' '}
        <ConsentLink href={PERSONAL_DATA_POLICY_LINK}>
          Положением об обработке персональных данных
        </ConsentLink>{' '}
        РУТ (МИИТ).
      </>
    ),
    section: 'personal',
  },
  {
    name: 'consent_personal_data_spread',
    label: (
      <>
        Выражаю{' '}
        <ConsentLink href={EROUTES.PRIVACY}>
          согласие на распространение персональных данных
        </ConsentLink>{' '}
        в целях освещения конкурса.
      </>
    ),
    section: 'competition',
  },
  {
    name: 'consent_competition_rules',
    label: (
      <>
        Подтверждаю, что ознакомился(-ась) с условиями участия, изложенными в{' '}
        <ConsentLink href={ORDER_LINK}>Положении</ConsentLink> и{' '}
        <ConsentLink href={REGULATION_LINK}>Регламенте</ConsentLink>.
      </>
    ),
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
        <Button text="Назад" onClick={onBack} />
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
