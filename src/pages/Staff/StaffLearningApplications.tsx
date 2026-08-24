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

interface IStaffLearningApplicationsProps {
  windowWidth: number;
  onLogout: () => void;
}

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

const StaffLearningApplications: FC<IStaffLearningApplicationsProps> = ({
  windowWidth,
  onLogout,
}) => {
  const [applications, setApplications] = useState<ILearningApplicationListItem[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const totalPages = Math.max(1, Math.ceil(totalCount / 20));

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
      windowWidth={windowWidth}
      isLoggedIn
      onLogout={onLogout}
    >
      <div className='staff-applications'>
        <div className='staff-applications__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='staff-applications__header'>
            <h1 className='staff-applications__title'>Заявки на обучение</h1>
            <input
              className='staff-applications__search'
              type='search'
              placeholder='Поиск по ФИО'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
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
                      <th>ФИО</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Статус</th>
                      <th>Обновлено</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className='staff-applications__empty'>
                          Заявки не найдены
                        </td>
                      </tr>
                    ) : (
                      applications.map((item) => (
                        <tr key={item.id}>
                          <td>{formatFullName(item)}</td>
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
