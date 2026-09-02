import type { FC, ChangeEvent } from 'react';
import type {
  ICoauthor,
  IFormData,
  IFormFieldDef,
  ISelectNomination,
  IStageFormProps,
} from '../../../interface/interface';
import type { IUploadFile, IUploadLink } from '../../../../../shared/components/Popup/interface/interface';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as api from '../../../../../shared/utils/api';
import type { IUpdatePracticeFormPayload } from '../../../../../shared/utils/api';
import { EROUTES } from '../../../../../shared/utils/ERoutes';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';
import SelectWithSearch from '../../../../../shared/components/Select/ui/SelectWithSearch';
import { FormField } from '../../../../../shared/components/Form/components/FormField/form-field';
import { FormInput } from '../../../../../shared/components/Form/components/FormInput/form-input';
import { FormTextarea } from '../../../../../shared/components/Form/components/FormTextarea/form-textarea';

import PracticeFormCoauthors from './PracticeFormCoauthors';
import PracticeFormMaterials from './PracticeFormMaterials';
import {
  PRACTICE_FORM_STEPS,
  getFieldsForStep,
  getNextStep,
  getPreviousStep,
  type TPracticeFormStep,
} from '../utils/formSteps';
import {
  validateAllRequired,
  validateCoauthors,
  validateStep,
  getFirstErrorStep,
} from '../utils/formValidation';

import '../styles/style.css';
import '../styles/practice-form.css';

const NOMINATION_PLACEHOLDER: ISelectNomination = {
  id: 0,
  name: 'Выберите номинацию',
};

const backButtonStyle = {
  backgroundColor: '#f4f8ff',
  color: 'var(--main-color)',
  border: 'none',
  fontWeight: 500,
};

const continueButtonStyle = {
  backgroundColor: 'var(--main-color)',
  color: '#fff',
  border: '1px solid var(--main-color)',
  fontWeight: 500,
};

const saveButtonStyle = {
  fontWeight: 500,
};

function getCoauthorsForSave(coauthors: ICoauthor[]) {
  return coauthors
    .filter(
      (item) =>
        item.full_name.trim() ||
        item.position.trim() ||
        item.educational_organization.trim(),
    )
    .map((item) => ({
      full_name: item.full_name.trim(),
      position: item.position.trim(),
      educational_organization: item.educational_organization.trim(),
    }));
}

function flattenErrors(errorData: unknown): Record<string, string> {
  if (Array.isArray(errorData) && errorData.length > 0) {
    return { non_field_errors: String(errorData[0]) };
  }
  if (!errorData || typeof errorData !== 'object') {
    return {};
  }
  const result: Record<string, string> = {};
  Object.entries(errorData as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = value;
      return;
    }
    if (Array.isArray(value) && value.length > 0) {
      result[key] = String(value[0]);
    }
  });
  return result;
}

const PersonStageForm: FC<IStageFormProps> = ({ onNextStage }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IFormData | null>(null);
  const [nominations, setNominations] = useState<ISelectNomination[]>([]);
  const [currentNomination, setCurrentNomination] =
    useState<ISelectNomination>(NOMINATION_PLACEHOLDER);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [coauthors, setCoauthors] = useState<ICoauthor[]>([]);
  const [schema, setSchema] = useState<IFormFieldDef[]>([]);
  const [currentStep, setCurrentStep] = useState<TPracticeFormStep>('about');

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [materialsError, setMaterialsError] = useState('');

  const nominationOptions = useMemo(
    () => [NOMINATION_PLACEHOLDER, ...nominations],
    [nominations],
  );

  const stepFields = useMemo(
    () => getFieldsForStep(schema, currentStep),
    [schema, currentStep],
  );

  const applyFormResponse = (response: IFormData) => {
    setFormData(response);
    setAnswers(response.answers ?? {});
    setCoauthors(response.coauthors ?? []);
    setSchema(response.schema ?? []);
    if (response.nomination) {
      const found = nominations.find((item) => item.id === response.nomination);
      if (found) {
        setCurrentNomination(found);
      }
    }
  };

  const loadData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    Promise.all([api.getNominations(), api.getFormData(token)])
      .then(([nominationsRes, formRes]) => {
        const nominationItems = nominationsRes.map((item: ISelectNomination) => ({
          id: item.id,
          name: item.name,
        }));
        setNominations(nominationItems);

        const foundNomination = nominationItems.find(
          (item: ISelectNomination) => item.id === formRes.nomination,
        );
        if (foundNomination) {
          setCurrentNomination(foundNomination);
        }
        setFormData(formRes);
        setAnswers(formRes.answers ?? {});
        setCoauthors(formRes.coauthors ?? []);
        setSchema(formRes.schema ?? []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoadingData(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleNominationChange = (option: ISelectNomination) => {
    setCurrentNomination(option);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.nomination;
      return next;
    });
  };

  const ensureNominationSelected = async () => {
    if (currentNomination.id === 0) {
      setFieldErrors({ nomination: 'Выберите номинацию.' });
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    if (formData?.nomination === currentNomination.id) {
      return true;
    }

    try {
      const response = await api.setNomination(token, currentNomination.id);
      applyFormResponse(response);
      return true;
    } catch {
      setFieldErrors({ nomination: 'Не удалось сохранить номинацию.' });
      return false;
    }
  };

  const saveDraft = async (includeCoauthors = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const nominationReady = await ensureNominationSelected();
    if (!nominationReady) {
      return false;
    }

    setIsSaving(true);
    setSaveMessage('');
    setMaterialsError('');

    try {
      const payload: IUpdatePracticeFormPayload = { answers };
      if (includeCoauthors) {
        payload.coauthors = getCoauthorsForSave(coauthors);
      }

      const response = await api.updatePracticeForm(token, payload);
      applyFormResponse(response);
      setSaveMessage('Черновик сохранён.');
      setFieldErrors({});
      return true;
    } catch (error) {
      setFieldErrors(flattenErrors(error));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await saveDraft(currentStep === 'materials');
  };

  const runStepValidation = (forSubmit: boolean) => {
    const stepErrors = forSubmit
      ? validateAllRequired(schema, answers, currentNomination.id)
      : validateStep(currentStep, schema, answers, currentNomination.id);

    const coauthorErrors =
      currentStep === 'materials' || forSubmit ? validateCoauthors(coauthors) : {};

    const errors = { ...stepErrors, ...coauthorErrors };

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSaveMessage('');
      if (forSubmit) {
        const errorStep = getFirstErrorStep(errors, schema);
        if (errorStep) {
          setCurrentStep(errorStep);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleContinue = async () => {
    const isLastStep = currentStep === 'materials';

    if (!runStepValidation(isLastStep)) {
      return;
    }

    const saved = await saveDraft(currentStep === 'materials');
    if (!saved) {
      return;
    }

    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep);
      setSaveMessage('');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    try {
      await api.submitPracticeForm(token);
      const refreshed = await api.getFormData(token);
      applyFormResponse(refreshed);
      setSaveMessage('');
      onNextStage();
    } catch (error) {
      setFieldErrors(flattenErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep);
      setSaveMessage('');
      return;
    }
    navigate(EROUTES.PERSON);
  };

  const handleUploadLink = async (data: IUploadLink) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    setMaterialsError('');
    setIsSaving(true);
    try {
      const resource = await api.uploadLink(token, data);
      if (formData) {
        setFormData({
          ...formData,
          resources: [...formData.resources, resource],
        });
      }
    } catch (error) {
      const errors = flattenErrors(error);
      setMaterialsError(errors.non_field_errors || Object.values(errors)[0] || 'Не удалось добавить ссылку.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadFile = async (data: IUploadFile) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    setMaterialsError('');
    setIsSaving(true);
    try {
      const resource = await api.uploadFile(token, data);
      if (formData) {
        setFormData({
          ...formData,
          resources: [...formData.resources, resource],
        });
      }
    } catch (error) {
      const errors = flattenErrors(error);
      setMaterialsError(errors.non_field_errors || Object.values(errors)[0] || 'Не удалось добавить файл.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMaterial = (id: string) => {
    const token = localStorage.getItem('token');
    if (!token || !formData) {
      return;
    }
    api
      .removeMaterial(token, id)
      .then(() => {
        setFormData({
          ...formData,
          resources: formData.resources.filter(
            (resource) => resource.id.toString() !== id,
          ),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderField = (field: IFormFieldDef) => {
    const value = answers[field.key] ?? '';
    const errorText = fieldErrors[field.key];
    const placeholder = field.hint || 'Введите значение';
    const isNameField = field.key === 'name';

    return (
      <FormField
        key={field.key}
        title={isNameField ? field.title : undefined}
        caption={field.help_text}
        fieldError={
          errorText
            ? {
                isShow: true,
                text: errorText,
              }
            : undefined
        }
      >
        {isNameField ? (
          <FormInput
            name={field.key}
            value={value}
            placeholder={placeholder || 'Введите название практики'}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleAnswerChange(field.key, event.target.value)
            }
            hasError={Boolean(errorText)}
          />
        ) : (
          <>
            {field.hint && (
              <p className='practice-form__field-prompt'>{field.hint}</p>
            )}
            <FormTextarea
              name={field.key}
              value={value}
              placeholder='Напишите текст'
              maxLength={field.max_length}
              rows={field.max_length > 1500 ? 8 : 6}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleAnswerChange(field.key, event.target.value)
              }
            />
            <p className='practice-form__counter'>
              {value.length}/{field.max_length}
            </p>
          </>
        )}
      </FormField>
    );
  };

  if (isLoadingData) {
    return (
      <div className='person-stage'>
        <Preloader />
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  if (formData.status === 'submitted') {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Анкета практики</h2>
        <p className='person-stage__lead'>
          Спасибо! Анкета практики успешно отправлена.
        </p>
        <p className='person-stage__subtitle'>
          Вы прошли в следующий этап Всероссийского конкурса лучших педагогических
          практик «Лидеры транспортного образования».
        </p>
      </div>
    );
  }

  const isLastStep = currentStep === 'materials';

  return (
    <div className='person-stage practice-form'>
      <div className='practice-form__header'>
        <h2 className='person-stage__title'>Анкета практики</h2>
        <p className='person-stage__lead'>
          Заполните короткую анкету о своей практике.
        </p>
      </div>

      <div className='practice-form__tabs'>
        {PRACTICE_FORM_STEPS.map((step) => (
          <button
            key={step.id}
            type='button'
            className={`practice-form__tab ${
              currentStep === step.id ? 'practice-form__tab_active' : ''
            }`}
            onClick={() => setCurrentStep(step.id)}
          >
            {step.label}
          </button>
        ))}
      </div>

      <div className='practice-form__content'>
        {currentStep === 'about' && (
          <>
            <FormField
              title='Выберите номинацию'
              fieldError={
                fieldErrors.nomination
                  ? { isShow: true, text: fieldErrors.nomination }
                  : undefined
              }
            >
              <SelectWithSearch
                options={nominationOptions}
                currentOption={currentNomination}
                onChooseOption={handleNominationChange}
              />
            </FormField>
            {stepFields.map(renderField)}
          </>
        )}

        {currentStep === 'description' && schema.length === 0 && (
          <p className='practice-form__section-caption'>
            Сначала выберите номинацию на вкладке «О практике».
          </p>
        )}
        {currentStep === 'description' && stepFields.map(renderField)}
        {currentStep === 'results' && schema.length === 0 && (
          <p className='practice-form__section-caption'>
            Сначала выберите номинацию на вкладке «О практике».
          </p>
        )}
        {currentStep === 'results' && stepFields.map(renderField)}

        {currentStep === 'materials' && (
          <>
            <PracticeFormCoauthors
              coauthors={coauthors}
              onChange={setCoauthors}
              fieldErrors={fieldErrors}
            />
            <PracticeFormMaterials
              resources={formData.resources}
              isLoading={isSaving}
              errorMessage={materialsError}
              onUploadLink={handleUploadLink}
              onUploadFile={handleUploadFile}
              onRemove={handleRemoveMaterial}
            />
          </>
        )}

        {saveMessage && <p className='practice-form__success'>{saveMessage}</p>}
      </div>

      <div className='practice-form__footer'>
        <Button
          text='Назад'
          onClick={handleBack}
          style={backButtonStyle}
        />
        <div className='practice-form__footer-actions'>
          <Button
            text={isSaving ? 'Сохранение...' : 'Сохранить'}
            color='gradient'
            onClick={handleSave}
            disabled={isSaving || isSubmitting}
            style={saveButtonStyle}
          />
          <Button
            text={
              isSubmitting
                ? 'Отправка...'
                : isLastStep
                  ? 'Отправить анкету'
                  : 'Продолжить'
            }
            onClick={handleContinue}
            disabled={isSaving || isSubmitting}
            style={continueButtonStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonStageForm;
