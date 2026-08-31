import type { FC, KeyboardEvent } from 'react';

import styles from '../styles/registration.module.scss';

export interface IRegistrationStepMeta {
  number: string;
  title: string;
  hint: string;
}

export const REGISTRATION_STEPS: IRegistrationStepMeta[] = [
  { number: '01', title: 'Личные данные', hint: 'ФИО и контакты' },
  { number: '02', title: 'Профинформация', hint: 'Организация и должность' },
  { number: '03', title: 'Личный кабинет', hint: 'Логин и пароль' },
  { number: '04', title: 'Подтверждение', hint: 'Согласие и отправка' },
];

interface IRegistrationStepsProps {
  currentStep: number;
  maxReachedStep: number;
  onStepSelect: (step: number) => void;
}

const RegistrationSteps: FC<IRegistrationStepsProps> = ({
  currentStep,
  maxReachedStep,
  onStepSelect,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, stepIndex: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onStepSelect(stepIndex);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Этапы регистрации</h2>
      <ul className={styles.stepsList} role="tablist" aria-label="Этапы регистрации">
        {REGISTRATION_STEPS.map((step, index) => {
          const stepIndex = index + 1;
          const isDone = stepIndex < currentStep;
          const isActive = stepIndex === currentStep;
          const isClickable = stepIndex <= maxReachedStep;
          const badgeClass = [
            styles.stepBadge,
            isActive ? styles.stepBadgeActive : '',
            isDone ? styles.stepBadgeDone : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={step.number} className={styles.stepItem} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-disabled={!isClickable}
                disabled={!isClickable}
                className={`${styles.stepTab} ${
                  isClickable ? styles.stepTabClickable : ''
                } ${isActive ? styles.stepTabActive : ''}`}
                onClick={() => onStepSelect(stepIndex)}
                onKeyDown={(event) => handleKeyDown(event, stepIndex)}
              >
                <div className={badgeClass}>{isDone ? '✓' : step.number}</div>
                <div className={styles.stepTexts}>
                  <p
                    className={`${styles.stepName} ${
                      isActive ? styles.stepNameActive : ''
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`${styles.stepHint} ${
                      isActive ? styles.stepHintActive : ''
                    }`}
                  >
                    {step.hint}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default RegistrationSteps;
