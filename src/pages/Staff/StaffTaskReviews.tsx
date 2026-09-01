import type { FC } from 'react';
import type { ILmsTaskReviewDetail, ILmsTaskReviewItem } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import Popup from '../../shared/components/Popup/ui/Popup';
import StaffBackButton from './components/StaffBackButton';
import closeIcon from '../../shared/icons/buttons/close-color.svg';
import {
  getLmsTaskReviewDetail,
  getLmsTaskReviewsList,
  reviewLmsTaskSubmission,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-task-reviews.css';

const formatDate = (value: string | null) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StaffTaskReviews: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<ILmsTaskReviewItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ILmsTaskReviewDetail | null>(
    null
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadSubmissions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await getLmsTaskReviewsList(token, { page });
      setSubmissions(response.results);
      setTotalCount(response.count);
      setHasNext(Boolean(response.next));
      setHasPrevious(Boolean(response.previous));
    } catch {
      setError('Не удалось загрузить список работ');
      setSubmissions([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const openSubmission = useCallback(async (submissionId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsDetailLoading(true);
    setFormError('');
    setReviewComment('');

    try {
      const detail = await getLmsTaskReviewDetail(token, submissionId);
      setSelectedSubmission(detail);
      setReviewComment(detail.reviewer_comment || '');
    } catch {
      setFormError('Не удалось загрузить работу');
      setSelectedSubmission(null);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    const submissionId = Number(searchParams.get('submission'));
    if (Number.isFinite(submissionId) && submissionId > 0) {
      openSubmission(submissionId);
    }
  }, [searchParams, openSubmission]);

  const closeModal = () => {
    setSelectedSubmission(null);
    setFormError('');
    if (searchParams.get('submission')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('submission');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleOpenRow = (submissionId: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('submission', String(submissionId));
    setSearchParams(nextParams, { replace: true });
    openSubmission(submissionId);
  };

  const handleReview = async (decision: 'accepted' | 'needs_revision') => {
    if (!selectedSubmission) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setFormError('Требуется авторизация');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const updated = await reviewLmsTaskSubmission(
        token,
        selectedSubmission.id,
        decision,
        reviewComment
      );
      setSelectedSubmission(updated);
      await loadSubmissions();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Не удалось сохранить результат проверки'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / 20));
  const isPending = selectedSubmission?.status === 'pending_review';

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
    >
      <div className='staff-task-reviews'>
        <div className='staff-task-reviews__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <h1 className='staff-task-reviews__title'>Проверка заданий</h1>

          {isLoading ? (
            <Preloader />
          ) : error ? (
            <p className='staff-task-reviews__error'>{error}</p>
          ) : (
            <>
              <div className='staff-task-reviews__table-wrap'>
                <table className='staff-task-reviews__table'>
                  <thead>
                    <tr>
                      <th>Слушатель</th>
                      <th>Курс</th>
                      <th>Задание</th>
                      <th>Статус</th>
                      <th>Дата сдачи</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className='staff-task-reviews__empty'>
                          Работы не найдены
                        </td>
                      </tr>
                    ) : (
                      submissions.map((item) => (
                        <tr
                          key={item.id}
                          className='staff-task-reviews__row'
                          onClick={() => handleOpenRow(item.id)}
                        >
                          <td>{item.learner_name}</td>
                          <td>{item.course_name}</td>
                          <td>{item.task_name}</td>
                          <td>{item.status_display}</td>
                          <td>{formatDate(item.submitted_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className='staff-task-reviews__pagination'>
                <Button
                  text='Назад'
                  color='primary'
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={!hasPrevious}
                />
                <span className='staff-task-reviews__page-info'>
                  Страница {page} из {totalPages} (всего: {totalCount})
                </span>
                <Button
                  text='Вперёд'
                  color='primary'
                  onClick={() => setPage((current) => current + 1)}
                  disabled={!hasNext}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Popup
        isOpen={Boolean(selectedSubmission) || isDetailLoading}
        onClose={closeModal}
        popupWidth='medium'
        closeOutside
      >
        {isDetailLoading ? (
          <Preloader />
        ) : selectedSubmission ? (
          <div className='staff-task-reviews__modal'>
            <div className='staff-task-reviews__modal-head'>
              <h2 className='staff-task-reviews__modal-title'>Проверка работы</h2>
              <button
                type='button'
                className='staff-task-reviews__modal-close'
                aria-label='Закрыть'
                onClick={closeModal}
              >
                <img src={closeIcon} alt='' aria-hidden='true' />
              </button>
            </div>

            <dl className='staff-task-reviews__meta'>
              <dt>Слушатель</dt>
              <dd>{selectedSubmission.learner_name}</dd>
              <dt>Email</dt>
              <dd>{selectedSubmission.learner_email}</dd>
              <dt>Курс</dt>
              <dd>{selectedSubmission.course_name}</dd>
              <dt>Задание</dt>
              <dd>{selectedSubmission.task_name}</dd>
              <dt>Статус</dt>
              <dd>{selectedSubmission.status_display}</dd>
              <dt>Комментарий слушателя</dt>
              <dd>{selectedSubmission.user_comment || '—'}</dd>
              <dt>Файл</dt>
              <dd>
                {selectedSubmission.file_url ? (
                  <a href={selectedSubmission.file_url} target='_blank' rel='noreferrer'>
                    Открыть файл
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </dl>

            <label className='staff-task-reviews__comment'>
              <span className='staff-task-reviews__comment-label'>Комментарий проверяющего</span>
              <textarea
                className='staff-task-reviews__comment-input'
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                rows={3}
                disabled={!isPending || isSubmitting}
              />
            </label>

            {selectedSubmission.reviewer_name ? (
              <p className='staff-task-reviews__reviewed-by'>
                Проверил: {selectedSubmission.reviewer_name}
                {selectedSubmission.reviewed_at
                  ? ` (${formatDate(selectedSubmission.reviewed_at)})`
                  : ''}
              </p>
            ) : null}

            {formError ? <p className='staff-task-reviews__error'>{formError}</p> : null}

            {isPending ? (
              <div className='staff-task-reviews__actions'>
                <Button
                  text={isSubmitting ? 'Сохранение...' : 'Принято'}
                  color='primary'
                  onClick={() => handleReview('accepted')}
                  disabled={isSubmitting}
                />
                <Button
                  text={isSubmitting ? 'Сохранение...' : 'Нужно доработать'}
                  color='primary'
                  onClick={() => handleReview('needs_revision')}
                  disabled={isSubmitting}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </Popup>
    </MainLayout>
  );
};

export default StaffTaskReviews;
