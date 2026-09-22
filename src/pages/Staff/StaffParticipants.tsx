import type { FC } from 'react';
import type { IStaffParticipantListItem } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import {
  exportStaffParticipantsReport,
  getStaffParticipantsList,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-learning-applications.css';

const BOOL_FILTER_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
] as const;

const formatFullName = (item: IStaffParticipantListItem) =>
  [item.lastName, item.firstName, item.middleName || ''].filter(Boolean).join(' ');

const formatBool = (value: boolean) => (value ? 'Да' : 'Нет');

const parseBoolFilter = (value: string): boolean | undefined => {
  if (value === 'yes') {
    return true;
  }
  if (value === 'no') {
    return false;
  }
  return undefined;
};

const StaffParticipants: FC = () => {
  const [participants, setParticipants] = useState<IStaffParticipantListItem[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [questionnaireFilter, setQuestionnaireFilter] = useState('');
  const [courseDocsFilter, setCourseDocsFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadParticipants = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError('');

    try {
      const response = await getStaffParticipantsList(token, {
        page,
        search: debouncedSearch,
        questionnaireSubmitted: parseBoolFilter(questionnaireFilter),
        courseDocumentsSubmitted: parseBoolFilter(courseDocsFilter),
      });
      setParticipants(response.results);
      setTotalCount(response.count);
      setHasNext(Boolean(response.next));
      setHasPrevious(Boolean(response.previous));
    } catch {
      setLoadError('Не удалось загрузить список участников');
      setParticipants([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, questionnaireFilter, courseDocsFilter]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setExportError('Требуется авторизация');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
      const blob = await exportStaffParticipantsReport(token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'staff_participants_report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError('Не удалось выгрузить Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const renderTableBody = () => {
    if (isLoading) {
      return <Preloader />;
    }
    if (loadError) {
      return <p className='staff-applications__error'>{loadError}</p>;
    }
    return (
      <>
        <div className='staff-applications__table-wrap'>
          <table className='staff-applications__table'>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>ВУЗ</th>
                <th>Номинация</th>
                <th>Анкета отправлена</th>
                <th>Документы на курс</th>
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={7} className='staff-applications__empty'>
                    Участники не найдены
                  </td>
                </tr>
              ) : (
                participants.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className='staff-applications__name'>
                        {formatFullName(item)}
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td>{item.phone || '—'}</td>
                    <td>{item.workplace || '—'}</td>
                    <td>{item.nomination || '—'}</td>
                    <td>{formatBool(item.questionnaireSubmitted)}</td>
                    <td>{formatBool(item.courseDocumentsSubmitted)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='staff-applications__pagination'>
          <Button
            text='Назад'
            color='primary'
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={!hasPrevious}
          />
          <span className='staff-applications__page-info'>
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
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / 20));

  return (
    <MainLayout mainContainer={false} transparentMain>
      <div className='staff-applications'>
        <div className='staff-applications__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='staff-applications__header'>
            <h1 className='staff-applications__title'>Участники конкурса</h1>
            <div className='staff-applications__filters'>
              <input
                className='staff-applications__search'
                type='search'
                placeholder='Поиск по ФИО или email'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                className='staff-applications__status-filter'
                value={questionnaireFilter}
                onChange={(event) => {
                  setQuestionnaireFilter(event.target.value);
                  setPage(1);
                }}
                aria-label='Анкета отправлена'
              >
                {BOOL_FILTER_OPTIONS.map((option) => (
                  <option key={`q-${option.value || 'all'}`} value={option.value}>
                    Анкета: {option.label}
                  </option>
                ))}
              </select>
              <select
                className='staff-applications__status-filter'
                value={courseDocsFilter}
                onChange={(event) => {
                  setCourseDocsFilter(event.target.value);
                  setPage(1);
                }}
                aria-label='Документы на курс поданы'
              >
                {BOOL_FILTER_OPTIONS.map((option) => (
                  <option key={`c-${option.value || 'all'}`} value={option.value}>
                    Документы: {option.label}
                  </option>
                ))}
              </select>
              <Button
                text={isExporting ? 'Выгрузка…' : 'Выгрузить в Excel'}
                color='primary'
                onClick={handleExport}
                disabled={isExporting}
              />
            </div>
          </div>

          {exportError ? (
            <p className='staff-applications__error'>{exportError}</p>
          ) : null}
          {renderTableBody()}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffParticipants;
