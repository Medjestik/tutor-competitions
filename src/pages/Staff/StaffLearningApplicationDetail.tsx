import type { FC } from 'react';
import type {
  ILearningApplicationResponse,
  IListenerConfirmedSections,
  IListenerFormState,
  TListenerTab,
} from '../Person/components/PersonLearning/interface/interface';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import Popup from '../../shared/components/Popup/ui/Popup';
import { useToast } from '../../shared/components/ToastProvider/ui/ToastProvider';
import {
  approveLearningApplication,
  getLearningApplicationDetail,
  rejectLearningApplication,
  requestLearningApplicationCorrection,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import PersonLearningListenerTabs from '../Person/components/PersonLearning/ui/listener/PersonLearningListenerTabs';
import PersonLearningListenerInfoTab from '../Person/components/PersonLearning/ui/listener/PersonLearningListenerInfoTab';
import PersonLearningListenerConsentTab from '../Person/components/PersonLearning/ui/listener/PersonLearningListenerConsentTab';
import PersonLearningListenerSnilsTab from '../Person/components/PersonLearning/ui/listener/PersonLearningListenerSnilsTab';
import PersonLearningListenerDiplomaTab from '../Person/components/PersonLearning/ui/listener/PersonLearningListenerDiplomaTab';
import {
  emptyConfirmedSections,
  initialListenerForm,
  listenerConfirmableTabs,
  listenerTabs,
  mapApplicationToConfirmedSections,
  mapApplicationToFormState,
} from '../Person/components/PersonLearning/mock/listenerContent';

import './staff-learning-applications.css';
import '../Person/components/PersonLearning/styles/style.css';
import '../Person/components/PersonLearning/styles/listener.css';


interface IStaffLearningApplicationDetailResponse extends ILearningApplicationResponse {
  statusDisplay?: string;
  snilsFileUrl?: string;
  diplomaFileUrl?: string;
  marriageCertFileUrl?: string;
  apostilleFileUrl?: string;
  degreeDiplomaFileUrl?: string;
}

type TStaffActionModal = 'none' | 'approve' | 'correction' | 'reject';

const staffTabs = listenerTabs.filter((tab) => tab.id !== 'review');

const sectionLabels: Record<keyof IListenerConfirmedSections, string> = {
  info: 'Информация о слушателе',
  consent: 'Обработка ПД',
  snils: 'СНИЛС',
  diploma: 'Диплом',
};

const noop = () => undefined;

const cancelBtnStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '120px',
  padding: '16px 24px',
  lineHeight: 1,
  background: '#f4f8ff',
  border: 'none',
};

const confirmBtnStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  height: '48px',
  minWidth: '160px',
  padding: '16px 24px',
  lineHeight: 1,
};

const getErrorMessage = async (error: unknown, fallback: string) => {
  if (error instanceof Response) {
    try {
      const data = await error.json();
      if (typeof data?.error === 'string') return data.error;
      if (typeof data?.detail === 'string') return data.detail;
      if (data?.comment?.[0]) return String(data.comment[0]);
      if (data?.sectionsToRevise?.[0]) return String(data.sectionsToRevise[0]);
      if (data?.non_field_errors?.[0]) return String(data.non_field_errors[0]);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const StaffLearningApplicationDetail: FC = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const applicationId = Number(id);
  const [activeTab, setActiveTab] = useState<TListenerTab>('info');
  const [formData, setFormData] = useState<IListenerFormState>(initialListenerForm);
  const [confirmedSections, setConfirmedSections] =
    useState<IListenerConfirmedSections>(emptyConfirmedSections);
  const [status, setStatus] = useState('');
  const [statusDisplay, setStatusDisplay] = useState('');
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [actionModal, setActionModal] = useState<TStaffActionModal>('none');
  const [sectionChecks, setSectionChecks] =
    useState<IListenerConfirmedSections>(emptyConfirmedSections);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');

  const isActionable = status === 'submitted';
  const fullName = useMemo(
    () =>
      [formData.lastName, formData.firstName, formData.middleName]
        .filter(Boolean)
        .join(' '),
    [formData]
  );

  const applyDetail = useCallback((data: IStaffLearningApplicationDetailResponse) => {
    setFormData(mapApplicationToFormState(data));
    const confirmed = mapApplicationToConfirmedSections(data);
    setConfirmedSections(confirmed);
    setSectionChecks(confirmed);
    setStatus(data.status || '');
    setStatusDisplay(data.statusDisplay || data.status || '');
    setFileUrls({
      snils: data.snilsFileUrl || '',
      diploma: data.diplomaFileUrl || '',
      marriageCert: data.marriageCertFileUrl || '',
      apostille: data.apostilleFileUrl || '',
      degreeDiploma: data.degreeDiplomaFileUrl || '',
    });
  }, []);

  const loadDetail = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !applicationId) {
      setError('Заявка не найдена');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data = (await getLearningApplicationDetail(
        token,
        applicationId
      )) as IStaffLearningApplicationDetailResponse;
      applyDetail(data);
    } catch {
      setError('Не удалось загрузить заявку');
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, applyDetail]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const closeModal = () => {
    if (isSubmitting) return;
    setActionModal('none');
    setFormError('');
    setComment('');
  };

  const openApproveModal = () => {
    setActionModal('approve');
    setFormError('');
  };

  const openCorrectionModal = () => {
    setActionModal('correction');
    setSectionChecks(confirmedSections);
    setComment('');
    setFormError('');
  };

  const openRejectModal = () => {
    setActionModal('reject');
    setComment('');
    setFormError('');
  };

  const handleApprove = async () => {
    if (!isActionable || isSubmitting) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSubmitting(true);
    try {
      const data = (await approveLearningApplication(
        token,
        applicationId
      )) as IStaffLearningApplicationDetailResponse;
      applyDetail(data);
      setActionModal('none');
      showToast({
        type: 'success',
        title: 'Заявка одобрена',
        text: 'Слушателю отправлено уведомление.',
      });
    } catch (err) {
      const message = await getErrorMessage(err, 'Не удалось одобрить заявку.');
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!isActionable || isSubmitting) return;

    const sectionsToRevise = listenerConfirmableTabs.filter(
      (section) => !sectionChecks[section]
    );
    if (!comment.trim()) {
      setFormError('Комментарий обязателен.');
      return;
    }
    if (sectionsToRevise.length === 0) {
      setFormError(
        'Снимите галочки с разделов, которые слушатель должен исправить.'
      );
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      const data = (await requestLearningApplicationCorrection(token, applicationId, {
        comment: comment.trim(),
        sectionsToRevise,
      })) as IStaffLearningApplicationDetailResponse;
      applyDetail(data);
      setActionModal('none');
      showToast({
        type: 'success',
        title: 'Отправлено на доработку',
        text: 'Слушателю отправлено уведомление.',
      });
    } catch (err) {
      const message = await getErrorMessage(err, 'Не удалось отправить на доработку.');
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!isActionable || isSubmitting) return;
    if (!comment.trim()) {
      setFormError('Комментарий обязателен.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      const data = (await rejectLearningApplication(token, applicationId, {
        comment: comment.trim(),
      })) as IStaffLearningApplicationDetailResponse;
      applyDetail(data);
      setActionModal('none');
      showToast({
        type: 'success',
        title: 'Заявка отклонена',
        text: 'Слушателю отправлено уведомление.',
      });
    } catch (err) {
      const message = await getErrorMessage(err, 'Не удалось отклонить заявку.');
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTabProps = () => ({
    formData,
    fieldErrors: {},
    isSectionConfirmed: true,
    isReadOnly: true,
    onChange: noop as <TKey extends keyof IListenerFormState>(
      key: TKey,
      value: IListenerFormState[TKey]
    ) => void,
    onSave: noop,
    onBack: noop,
    onContinue: noop,
    onSubmit: noop,
    isSaving: false,
    isUploading: false,
  });

  const fileLinks = [
    { key: 'snils', label: 'СНИЛС', url: fileUrls.snils },
    { key: 'diploma', label: 'Диплом', url: fileUrls.diploma },
    { key: 'marriageCert', label: 'Свидетельство о браке', url: fileUrls.marriageCert },
    { key: 'apostille', label: 'Апостиль', url: fileUrls.apostille },
    { key: 'degreeDiploma', label: 'Диплом об учёной степени', url: fileUrls.degreeDiploma },
  ].filter((item) => item.url);

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
    >
      <div className='staff-detail'>
        {isLoading ? (
          <div className='staff-detail__card'>
            <Preloader />
          </div>
        ) : error ? (
          <div className='staff-detail__card'>
            <Link className='staff-detail__back' to={EROUTES.STAFF_LEARNING_APPLICATIONS}>
              ← К списку заявок
            </Link>
            <p className='staff-detail__error'>{error}</p>
          </div>
        ) : (
          <>
            <div className='staff-detail__card person-learning'>
              <div className='staff-detail__top'>
                <div>
                  <Link
                    className='staff-detail__back'
                    to={EROUTES.STAFF_LEARNING_APPLICATIONS}
                  >
                    ← К списку заявок
                  </Link>
                  <h1 className='staff-detail__title'>
                    {fullName || `Заявка #${applicationId}`}
                  </h1>
                  <p className='staff-detail__meta'>
                    ID: {applicationId}
                    {statusDisplay ? ` · Статус: ${statusDisplay}` : ''}
                    {formData.email ? ` · ${formData.email}` : ''}
                  </p>
                </div>
              </div>

              {fileLinks.length > 0 && (
                <div className='staff-detail__file-links'>
                  {fileLinks.map((item) => (
                    <a
                      key={item.key}
                      className='staff-detail__file-link'
                      href={item.url}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Скачать: {item.label}
                    </a>
                  ))}
                </div>
              )}

              <PersonLearningListenerTabs
                activeTab={activeTab}
                onChange={(tab) => {
                  if (tab !== 'review') {
                    setActiveTab(tab);
                  }
                }}
                confirmedSections={confirmedSections}
                tabs={staffTabs}
              />

              <div className='person-learning__body'>
                {activeTab === 'info' && (
                  <PersonLearningListenerInfoTab {...getTabProps()} />
                )}
                {activeTab === 'consent' && (
                  <PersonLearningListenerConsentTab {...getTabProps()} />
                )}
                {activeTab === 'snils' && (
                  <PersonLearningListenerSnilsTab {...getTabProps()} />
                )}
                {activeTab === 'diploma' && (
                  <PersonLearningListenerDiplomaTab {...getTabProps()} />
                )}
              </div>
            </div>

            <div className='staff-detail__actions'>
              {!isActionable && (
                <p className='staff-detail__actions-hint'>
                  Действия доступны только для заявок со статусом «Подана».
                </p>
              )}
              <div className='staff-detail__actions-buttons'>
                <Button
                  text='Одобрить'
                  color='primary'
                  onClick={openApproveModal}
                  disabled={!isActionable || isSubmitting}
                />
                <Button
                  text='На исправление'
                  color='white'
                  onClick={openCorrectionModal}
                  disabled={!isActionable || isSubmitting}
                />
                <Button
                  text='Отклонить'
                  color='white'
                  onClick={openRejectModal}
                  disabled={!isActionable || isSubmitting}
                />
              </div>
            </div>

            <Popup
              isOpen={actionModal === 'approve'}
              onClose={closeModal}
              popupWidth='medium'
              closeOutside={false}
            >
              <h2 className='popup__title'>Одобрить заявку?</h2>
              <p className='staff-detail__modal-text'>
                Слушателю будет отправлено письмо о том, что заявка одобрена и можно
                приступать к обучению.
              </p>
              {formError && <p className='staff-detail__field-error'>{formError}</p>}
              <div className='staff-detail__modal-actions'>
                <Button
                  text='Отменить'
                  color='primary'
                  onClick={closeModal}
                  style={cancelBtnStyle}
                  disabled={isSubmitting}
                />
                <Button
                  text={isSubmitting ? 'Отправка...' : 'Одобрить'}
                  color='gradient'
                  onClick={handleApprove}
                  style={confirmBtnStyle}
                  disabled={isSubmitting}
                />
              </div>
            </Popup>

            <Popup
              isOpen={actionModal === 'correction'}
              onClose={closeModal}
              popupWidth='medium'
              closeOutside={false}
            >
              <h2 className='popup__title'>Отправить на исправление</h2>
              <p className='staff-detail__modal-text'>
                Снимите галочки с разделов, которые слушатель должен исправить. Снятые
                разделы станут доступны для редактирования, а комментарий увидит
                слушатель в личном кабинете и в письме.
              </p>
              <div className='staff-detail__checkboxes'>
                {listenerConfirmableTabs.map((section) => (
                  <label key={section} className='staff-detail__checkbox'>
                    <input
                      type='checkbox'
                      checked={sectionChecks[section]}
                      onChange={(event) =>
                        setSectionChecks((prev) => ({
                          ...prev,
                          [section]: event.target.checked,
                        }))
                      }
                    />
                    {sectionLabels[section]}
                  </label>
                ))}
              </div>
              <label className='staff-detail__label' htmlFor='correction-comment'>
                Комментарий
              </label>
              <textarea
                id='correction-comment'
                className='staff-detail__textarea'
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder='Опишите, что нужно исправить'
              />
              {formError && <p className='staff-detail__field-error'>{formError}</p>}
              <div className='staff-detail__modal-actions'>
                <Button
                  text='Отменить'
                  color='primary'
                  onClick={closeModal}
                  style={cancelBtnStyle}
                  disabled={isSubmitting}
                />
                <Button
                  text={isSubmitting ? 'Отправка...' : 'Отправить на доработку'}
                  color='gradient'
                  onClick={handleRequestCorrection}
                  style={confirmBtnStyle}
                  disabled={isSubmitting}
                />
              </div>
            </Popup>

            <Popup
              isOpen={actionModal === 'reject'}
              onClose={closeModal}
              popupWidth='medium'
              closeOutside={false}
            >
              <h2 className='popup__title'>Отклонить заявку</h2>
              <p className='staff-detail__modal-text'>
                Комментарий обязателен и будет отправлен слушателю в письме.
              </p>
              <label className='staff-detail__label' htmlFor='reject-comment'>
                Комментарий
              </label>
              <textarea
                id='reject-comment'
                className='staff-detail__textarea'
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder='Укажите причину отклонения'
              />
              {formError && <p className='staff-detail__field-error'>{formError}</p>}
              <div className='staff-detail__modal-actions'>
                <Button
                  text='Отменить'
                  color='primary'
                  onClick={closeModal}
                  style={cancelBtnStyle}
                  disabled={isSubmitting}
                />
                <Button
                  text={isSubmitting ? 'Отправка...' : 'Отклонить'}
                  color='gradient'
                  onClick={handleReject}
                  style={confirmBtnStyle}
                  disabled={isSubmitting}
                />
              </div>
            </Popup>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default StaffLearningApplicationDetail;
