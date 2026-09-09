import type { FC } from 'react';
import type { ILearningApplicationListItem } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import { getLearningApplicationsList } from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-learning-applications.css';

type TSortField = 'lastName' | 'workplace' | 'status' | 'updatedAt';

const ORDERING_API_KEYS: Record<TSortField, string> = {
  lastName: 'lastName',
  workplace: 'workplace',
  status: 'status',
  updatedAt: 'updated_at',
};

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'filling', label: 'На заполнении' },
  { value: 'submitted', label: 'Подана' },
  { value: 'correction_required', label: 'На исправлении' },
  { value: 'approved', label: 'Одобрена' },
  { value: 'rejected', label: 'Отклонена' },
] as const;

const formatFullName = (item: ILearningApplicationListItem) =>
  [item.lastName, item.firstName, item.middleName || ''].filter(Boolean).join(' ');

const formatDate = (value: string) => {
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

const StaffLearningApplications: FC = () => {
  const [applications, setApplications] = useState<ILearningApplicationListItem[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<TSortField | null>(null);
  const [sortDesc, setSortDesc] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const ordering =
    sortField === null
      ? undefined
      : `${sortDesc ? '-' : ''}${ORDERING_API_KEYS[sortField]}`;

  const loadApplications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await getLearningApplicationsList(token, {
        page,
        search: debouncedSearch,
        status: statusFilter || undefined,
        ordering,
      });
      setApplications(response.results);
      setTotalCount(response.count);
      setHasNext(Boolean(response.next));
      setHasPrevious(Boolean(response.previous));
    } catch {
      setError('Не удалось загрузить список заявок');
      setApplications([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, ordering]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSort = (field: TSortField) => {
    setPage(1);
    if (sortField === field) {
      if (!sortDesc) {
        setSortDesc(true);
        return;
      }
      setSortField(null);
      setSortDesc(false);
      return;
    }
    setSortField(field);
    setSortDesc(false);
  };

  const sortIndicator = (field: TSortField) => {
    if (sortField !== field) {
      return '';
    }
    return sortDesc ? ' ↓' : ' ↑';
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / 20));

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
    >
      <div className='staff-applications'>
        <div className='staff-applications__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='staff-applications__header'>
            <h1 className='staff-applications__title'>Заявки на обучение</h1>
            <div className='staff-applications__filters'>
              <input
                className='staff-applications__search'
                type='search'
                placeholder='Поиск по ФИО'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                className='staff-applications__status-filter'
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label='Фильтр по статусу'
              >
                {STATUS_FILTER_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <Preloader />
          ) : error ? (
            <p className='staff-applications__error'>{error}</p>
          ) : (
            <>
              <div className='staff-applications__table-wrap'>
                <table className='staff-applications__table'>
                  <thead>
                    <tr>
                      <th
                        className='staff-applications__th-sortable'
                        onClick={() => handleSort('lastName')}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSort('lastName');
                          }
                        }}
                        role='button'
                        tabIndex={0}
                      >
                        ФИО{sortIndicator('lastName')}
                      </th>
                      <th
                        className='staff-applications__th-sortable'
                        onClick={() => handleSort('workplace')}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSort('workplace');
                          }
                        }}
                        role='button'
                        tabIndex={0}
                      >
                        Место работы{sortIndicator('workplace')}
                      </th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th
                        className='staff-applications__th-sortable'
                        onClick={() => handleSort('status')}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSort('status');
                          }
                        }}
                        role='button'
                        tabIndex={0}
                      >
                        Статус{sortIndicator('status')}
                      </th>
                      <th
                        className='staff-applications__th-sortable'
                        onClick={() => handleSort('updatedAt')}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSort('updatedAt');
                          }
                        }}
                        role='button'
                        tabIndex={0}
                      >
                        Обновлено{sortIndicator('updatedAt')}
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className='staff-applications__empty'>
                          Заявки не найдены
                        </td>
                      </tr>
                    ) : (
                      applications.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className='staff-applications__name'>
                              {formatFullName(item)}
                            </div>
                          </td>
                          <td>{item.workplace || '—'}</td>
                          <td>{item.email}</td>
                          <td>{item.phone || '—'}</td>
                          <td>{item.statusDisplay}</td>
                          <td>{formatDate(item.updatedAt)}</td>
                          <td>
                            <Link
                              className='staff-applications__link'
                              to={EROUTES.STAFF_LEARNING_APPLICATION.replace(
                                ':id',
                                String(item.id)
                              )}
                            >
                              Открыть
                            </Link>
                          </td>
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
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffLearningApplications;
