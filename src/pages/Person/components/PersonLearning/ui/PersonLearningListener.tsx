import type { FC } from 'react';
import type {
  ILearningApplicationResponse,
  IListenerConfirmedSections,
  IListenerFormState,
  TLearningDocumentType,
  TListenerFieldErrors,
  TListenerTab,
} from '../interface/interface';

import { useCallback, useContext, useEffect, useState } from 'react';

import { CurrentUserContext } from '../../../../../shared/context/team';
import { useToast } from '../../../../../shared/components/ToastProvider/ui/ToastProvider';
import { GetBase64File } from '../../../../../shared/lib/getBase64File';
import {
  confirmLearningSection,
  getLearningApplication,
  submitLearningApplication,
  updateLearningApplication,
  uploadLearningDocument,
} from '../../../../../shared/utils/api';

import PersonLearningListenerTabs from './listener/PersonLearningListenerTabs';
import PersonLearningListenerInfoTab from './listener/PersonLearningListenerInfoTab';
import PersonLearningListenerConsentTab from './listener/PersonLearningListenerConsentTab';
import PersonLearningListenerSnilsTab from './listener/PersonLearningListenerSnilsTab';
import PersonLearningListenerDiplomaTab from './listener/PersonLearningListenerDiplomaTab';
import PersonLearningListenerReviewTab from './listener/PersonLearningListenerReviewTab';
import PersonLearningListenerConfirmModal from './listener/PersonLearningListenerConfirmModal';

import {
  areAllListenerSectionsConfirmed,
  buildLearningApplicationPayloadForSection,
  createListenerFormFromUser,
  emptyConfirmedSections,
  getFirstUnconfirmedListenerTab,
  listenerContent,
  listenerTabOrder,
  mapApplicationToConfirmedSections,
  mapApplicationToFormState,
} from '../mock/listenerContent';
import {
  getFirstListenerFieldErrorKey,
  getListenerFieldNameAttribute,
  hasListenerFieldErrors,
  validateListenerSection,
} from '../lib/listenerValidation';

import '../styles/style.css';

const getErrorMessage = async (error: unknown, fallback: string) => {
  if (error instanceof Response) {
    try {
      const data = await error.json();
      if (typeof data?.error === 'string') return data.error;
      if (typeof data?.detail === 'string') return data.detail;
      if (data?.password?.[0]) return String(data.password[0]);
      if (data?.agreed?.[0]) return String(data.agreed[0]);
      if (data?.non_field_errors?.[0]) return String(data.non_field_errors[0]);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const applyApplicationResponse = (
  data: ILearningApplicationResponse,
  setFormData: (value: IListenerFormState) => void,
  setConfirmedSections: (value: IListenerConfirmedSections) => void,
  setApplicationStatus: (value: string) => void,
  setOrganizerComment: (value: string) => void
) => {
  setFormData(mapApplicationToFormState(data));
  setConfirmedSections(mapApplicationToConfirmedSections(data));
  setApplicationStatus(data.status || 'filling');
  setOrganizerComment(data.organizerComment || '');
};

const PersonLearningListener: FC = () => {
  const currentUser = useContext(CurrentUserContext);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TListenerTab>('info');
  const [formData, setFormData] = useState<IListenerFormState>(() =>
    createListenerFormFromUser(currentUser)
  );
  const [confirmedSections, setConfirmedSections] =
    useState<IListenerConfirmedSections>(emptyConfirmedSections);
  const [applicationStatus, setApplicationStatus] = useState('filling');
  const [organizerComment, setOrganizerComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmSection, setConfirmSection] = useState<TListenerTab>('info');
  const [confirmError, setConfirmError] = useState('');
  const [submitAfterConfirm, setSubmitAfterConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<TListenerFieldErrors>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isFormLocked = ['submitted', 'approved', 'rejected'].includes(
    applicationStatus
  );
  const allSectionsConfirmed = areAllListenerSectionsConfirmed(confirmedSections);

  const applyResponse = useCallback((data: ILearningApplicationResponse) => {
    applyApplicationResponse(
      data,
      setFormData,
      setConfirmedSections,
      setApplicationStatus,
      setOrganizerComment
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (currentUser.id) {
        setFormData(createListenerFormFromUser(currentUser));
      }
      return;
    }

    getLearningApplication(token)
      .then((data: ILearningApplicationResponse) => {
        applyResponse(data);
        setActiveTab(
          getFirstUnconfirmedListenerTab(
            mapApplicationToConfirmedSections(data),
            ['submitted', 'approved', 'rejected'].includes(data.status)
          )
        );
      })
      .catch(() => {
        if (currentUser.id) {
          setFormData(createListenerFormFromUser(currentUser));
        }
      });
  }, [currentUser.id, applyResponse]);

  const handleChange = <TKey extends keyof IListenerFormState>(
    key: TKey,
    value: IListenerFormState[TKey]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (showValidationErrors && fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const scrollToFirstFieldError = (section: TListenerTab, errors: TListenerFieldErrors) => {
    const firstKey = getFirstListenerFieldErrorKey(section, errors);
    if (!firstKey) return;

    const fieldName = getListenerFieldNameAttribute(firstKey);
    const element =
      document.querySelector(`[data-listener-field="${fieldName}"]`) ||
      document.querySelector(`[name="${fieldName}"]`);

    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const validateActiveSection = (section: TListenerTab): boolean => {
    const errors = validateListenerSection(section, formData);
    setFieldErrors(errors);
    setShowValidationErrors(true);

    if (hasListenerFieldErrors(errors)) {
      showToast({
        type: 'error',
        title: 'Проверьте форму',
        text: 'Заполните обязательные поля.',
      });
      scrollToFirstFieldError(section, errors);
      return false;
    }

    return true;
  };

  const saveApplication = async (section: TListenerTab) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    const payload = buildLearningApplicationPayloadForSection(section, formData);
    if (Object.keys(payload).length === 0) {
      return null;
    }

    const data = (await updateLearningApplication(
      token,
      payload
    )) as ILearningApplicationResponse;
    applyResponse(data);
    return data;
  };

  const handleSave = async () => {
    if (activeTab === 'review' || confirmedSections[activeTab as keyof IListenerConfirmedSections] || isFormLocked) {
      return;
    }

    setIsSaving(true);
    try {
      const data = await saveApplication(activeTab);
      if (!data) {
        showToast({
          type: 'success',
          title: 'Сохранено',
          text: 'Изменений для сохранения нет.',
        });
        return;
      }
      showToast({
        type: 'success',
        title: 'Сохранено',
        text: 'Данные слушателя успешно сохранены.',
      });
    } catch (error) {
      const message = await getErrorMessage(error, 'Не удалось сохранить данные.');
      showToast({ type: 'error', title: 'Ошибка', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const openConfirmModal = (section: TListenerTab, shouldSubmit = false) => {
    setConfirmSection(section);
    setConfirmError('');
    setSubmitAfterConfirm(shouldSubmit);
    setConfirmModalOpen(true);
  };

  const handleConfirmContinue = async () => {
    if (activeTab === 'review' || confirmedSections[activeTab as keyof IListenerConfirmedSections] || isFormLocked) {
      return;
    }

    if (!validateActiveSection(activeTab)) {
      return;
    }

    setIsSaving(true);
    try {
      const data = await saveApplication(activeTab);
      if (!data) {
        openConfirmModal(activeTab, false);
        return;
      }
      openConfirmModal(activeTab, false);
    } catch (error) {
      const message = await getErrorMessage(error, 'Не удалось сохранить данные.');
      showToast({ type: 'error', title: 'Ошибка', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = () => {
    if (isFormLocked || !allSectionsConfirmed) {
      return;
    }

    openConfirmModal('review', true);
  };

  const handleConfirmModalSubmit = async (password?: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setConfirmError('Требуется авторизация');
      return;
    }

    setIsConfirming(true);
    setConfirmError('');

    try {
      if (submitAfterConfirm && confirmSection === 'review') {
        await submitLearningApplication(token);
        setApplicationStatus('submitted');
        showToast({
          type: 'success',
          title: 'Заявка подана',
          text: 'Документы успешно отправлены на проверку.',
        });
        setConfirmModalOpen(false);
        return;
      }

      const confirmed = (await confirmLearningSection(
        token,
        confirmSection,
        password
      )) as ILearningApplicationResponse;
      applyResponse(confirmed);

      showToast({
        type: 'success',
        title: 'Подтверждено',
        text: 'Раздел успешно подтверждён.',
      });
      setConfirmModalOpen(false);

      const currentIndex = listenerTabOrder.indexOf(confirmSection);
      if (currentIndex < listenerTabOrder.length - 1) {
        setActiveTab(listenerTabOrder[currentIndex + 1]);
      }
    } catch (error) {
      const message = await getErrorMessage(error, 'Не удалось подтвердить раздел.');
      setConfirmError(message);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleUploadDocument = async (
    documentType: TLearningDocumentType,
    file: File
  ) => {
    const sectionByDocument: Partial<
      Record<TLearningDocumentType, keyof IListenerConfirmedSections>
    > = {
      snils: 'snils',
      diploma: 'diploma',
    };
    const section = sectionByDocument[documentType];

    if (
      isFormLocked ||
      (section && confirmedSections[section]) ||
      (documentType !== 'snils' &&
        documentType !== 'diploma' &&
        confirmedSections.diploma)
    ) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast({
        type: 'error',
        title: 'Ошибка',
        text: 'Требуется авторизация',
      });
      return;
    }

    setIsUploading(true);
    try {
      if (section === 'snils') {
        await saveApplication('snils');
      }

      const fileData = await GetBase64File(file);
      const data = (await uploadLearningDocument(
        token,
        documentType,
        fileData,
        file.name
      )) as ILearningApplicationResponse;
      applyResponse(data);
      if (documentType === 'snils') {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.snilsFileName;
          return next;
        });
      }
      if (documentType === 'diploma') {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.diplomaFileName;
          return next;
        });
      }
      showToast({
        type: 'success',
        title: 'Файл загружен',
        text: 'Документ успешно сохранён.',
      });
    } catch (error) {
      const message = await getErrorMessage(error, 'Не удалось загрузить документ.');
      showToast({ type: 'error', title: 'Ошибка', text: message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    const currentIndex = listenerTabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(listenerTabOrder[currentIndex - 1]);
    }
  };

  const getTabProps = (section: TListenerTab) => ({
    formData,
    fieldErrors,
    isSectionConfirmed: section !== 'review' && confirmedSections[section],
    isReadOnly:
      section === 'review'
        ? isFormLocked
        : confirmedSections[section] || isFormLocked,
    allSectionsConfirmed,
    isApplicationSubmitted: isFormLocked,
    applicationStatus,
    organizerComment,
    onChange: handleChange,
    onSave: handleSave,
    onBack: handleBack,
    onContinue: handleConfirmContinue,
    onSubmit: handleSubmitForReview,
    onUploadDocument: handleUploadDocument,
    isSaving,
    isUploading,
  });

  return (
    <div className='person-learning'>
      <div className='person-learning__header'>
        <h2 className='person-learning__title'>{listenerContent.title}</h2>
        <p className='person-learning__lead'>{listenerContent.lead}</p>
      </div>

      {applicationStatus === 'correction_required' && organizerComment && (
        <div className='person-learning-organizer-comment'>
          <p className='person-learning-organizer-comment__title'>
            Комментарий организатора
          </p>
          <p className='person-learning-organizer-comment__text'>{organizerComment}</p>
        </div>
      )}

      {applicationStatus === 'approved' && (
        <div className='person-learning-organizer-comment person-learning-organizer-comment_success'>
          <p className='person-learning-organizer-comment__title'>Заявка одобрена</p>
          <p className='person-learning-organizer-comment__text'>
            Вы можете приступать к обучению.
          </p>
        </div>
      )}

      {applicationStatus === 'rejected' && (
        <div className='person-learning-organizer-comment person-learning-organizer-comment_error'>
          <p className='person-learning-organizer-comment__title'>Заявка отклонена</p>
          {organizerComment && (
            <p className='person-learning-organizer-comment__text'>{organizerComment}</p>
          )}
        </div>
      )}

      <PersonLearningListenerTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        confirmedSections={confirmedSections}
      />

      <div className='person-learning__body'>
        {activeTab === 'info' && <PersonLearningListenerInfoTab {...getTabProps('info')} />}
        {activeTab === 'consent' && (
          <PersonLearningListenerConsentTab {...getTabProps('consent')} />
        )}
        {activeTab === 'snils' && <PersonLearningListenerSnilsTab {...getTabProps('snils')} />}
        {activeTab === 'diploma' && (
          <PersonLearningListenerDiplomaTab {...getTabProps('diploma')} />
        )}
        {activeTab === 'review' && (
          <PersonLearningListenerReviewTab {...getTabProps('review')} />
        )}
      </div>

      <PersonLearningListenerConfirmModal
        isOpen={confirmModalOpen}
        section={confirmSection}
        isLoading={isConfirming}
        error={confirmError}
        onClose={() => {
          if (!isConfirming) {
            setConfirmModalOpen(false);
            setConfirmError('');
          }
        }}
        onConfirm={handleConfirmModalSubmit}
      />
    </div>
  );
};

export default PersonLearningListener;
