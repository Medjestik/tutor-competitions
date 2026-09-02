import type { FC, FormEvent } from 'react';
import type { IRegisterData, TRegistrationStep } from '../interface/interface';
import type { ISelectOption } from '../../../shared/components/Select/interface/interface';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../shared/hooks/useForm';
import { registration } from '../../../shared/utils/api';
import { EROUTES } from '../../../shared/utils/ERoutes';

import RegistrationSteps from './RegistrationSteps';
import PersonalDataStep from './steps/PersonalDataStep';
import ProfessionalStep from './steps/ProfessionalStep';
import AccountStep from './steps/AccountStep';
import ConfirmationStep from './steps/ConfirmationStep';
import RegistrationErrorPopup from './RegistrationErrorPopup';

import {
  getTimezone,
  initialRegistrationValues,
  isAccountStepValid,
  isConfirmationStepValid,
  isPersonalStepValid,
  isProfessionalStepValid,
  resolveOrganizationName,
  validationSchema,
} from '../lib/helpers';
import {
  ORGANIZATION_PLACEHOLDER,
  OTHER_ORGANIZATION,
} from '../lib/organizations';

import styles from '../styles/registration.module.scss';

const RegistrationForm: FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<TRegistrationStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [selectedOrganization, setSelectedOrganization] = useState<ISelectOption>(
    ORGANIZATION_PLACEHOLDER
  );
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const {
    values,
    handleChange,
    handleSelectChange,
    handleCheckboxToggle,
    setFieldValue,
    errors,
  } = useForm(initialRegistrationValues, validationSchema);

  const isPersonalValid = useMemo(
    () => isPersonalStepValid(values, errors),
    [values, errors]
  );
  const isProfessionalValid = useMemo(
    () => isProfessionalStepValid(values, errors),
    [values, errors]
  );
  const isAccountValid = useMemo(
    () => isAccountStepValid(values, errors),
    [values, errors]
  );
  const isConfirmationValid = useMemo(
    () => isConfirmationStepValid(values),
    [values]
  );

  const handleChooseOrganization = (option: ISelectOption) => {
    setSelectedOrganization(option);
    handleSelectChange(
      'educational_organization',
      option.id === 0 ? '' : option.name
    );
    if (option.id !== OTHER_ORGANIZATION.id) {
      setFieldValue('other_organization', '');
    }
  };

  const handleSubmit = async () => {
    if (!isConfirmationValid || isLoadingRequest) {
      return;
    }

    const data: IRegisterData = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      middle_name: values.middle_name.trim(),
      email: values.email.trim(),
      phone_number: values.phone_number.trim(),
      telegram_username: '',
      username: values.username.trim(),
      password: values.password,
      educational_organization: resolveOrganizationName(values),
      main_position: values.main_position.trim(),
      timezone: getTimezone(),
    };

    setIsLoadingRequest(true);
    try {
      await registration(data);
      navigate(EROUTES.LOGIN);
    } catch (error) {
      console.error(error);
      setIsErrorOpen(true);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const goToStep = (nextStep: TRegistrationStep) => {
    setStep(nextStep);
    setMaxReachedStep((prev) => Math.max(prev, nextStep));
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 1:
        return isPersonalValid;
      case 2:
        return isProfessionalValid;
      case 3:
        return isAccountValid;
      case 4:
        return isConfirmationValid;
      default:
        return false;
    }
  };

  const handleStepSelect = (targetStep: number) => {
    if (targetStep < 1 || targetStep > 4 || targetStep === step) {
      return;
    }

    if (targetStep <= maxReachedStep) {
      setStep(targetStep as TRegistrationStep);
      return;
    }

    if (targetStep === step + 1 && isStepValid(step)) {
      goToStep(targetStep as TRegistrationStep);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 4) {
      void handleSubmit();
    }
  };

  return (
    <>
      <main className={styles.main}>
        <form className={styles.wizard} onSubmit={handleFormSubmit} noValidate>
          <RegistrationSteps
            currentStep={step}
            maxReachedStep={maxReachedStep}
            onStepSelect={handleStepSelect}
          />
          <div className={styles.content}>
            {step === 1 && (
              <PersonalDataStep
                values={values}
                errors={errors}
                isNextBlocked={!isPersonalValid}
                onChange={handleChange}
                onNext={() => goToStep(2)}
              />
            )}
            {step === 2 && (
              <ProfessionalStep
                values={values}
                errors={errors}
                selectedOrganization={selectedOrganization}
                isNextBlocked={!isProfessionalValid}
                onChange={handleChange}
                onChooseOrganization={handleChooseOrganization}
                onBack={() => setStep(1)}
                onNext={() => goToStep(3)}
              />
            )}
            {step === 3 && (
              <AccountStep
                values={values}
                errors={errors}
                isNextBlocked={!isAccountValid}
                onChange={handleChange}
                onBack={() => setStep(2)}
                onNext={() => goToStep(4)}
              />
            )}
            {step === 4 && (
              <ConfirmationStep
                values={values}
                isSubmitBlocked={!isConfirmationValid}
                isLoading={isLoadingRequest}
                onToggleConsent={handleCheckboxToggle}
                onBack={() => setStep(3)}
                onSubmit={() => {
                  void handleSubmit();
                }}
              />
            )}
          </div>
        </form>
      </main>

      <RegistrationErrorPopup
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
      />
    </>
  );
};

export default RegistrationForm;
