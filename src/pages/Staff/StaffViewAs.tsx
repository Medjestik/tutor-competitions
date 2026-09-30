import type { FC } from 'react';
import type { IViewAsUserSearchItem } from '../../shared/api/viewAs';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../store/store';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import { searchViewAsUsers } from '../../shared/api/viewAs';
import { startViewAsUser } from '../../store/user/actions';
import { EROUTES } from '../../shared/utils/ERoutes';
import { getAccessToken } from '../../shared/utils/viewAsSession';

import './staff-learning-applications.css';

const ROLE_LABELS: Record<string, string> = {
  participant: 'Участник',
  expert: 'Эксперт',
  organizer: 'Организатор',
};

const StaffViewAs: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [results, setResults] = useState<IViewAsUserSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [startingUserId, setStartingUserId] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadResults = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setLoadError('Требуется авторизация');
      setResults([]);
      return;
    }

    setIsLoading(true);
    setLoadError('');
    try {
      const response = await searchViewAsUsers(token, debouncedSearch);
      setResults(response.results);
    } catch {
      setLoadError('Не удалось найти пользователей');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleStartViewAs = async (userId: number) => {
    setActionError('');
    setStartingUserId(userId);
    try {
      await dispatch(startViewAsUser(userId)).unwrap();
      navigate(EROUTES.PERSON);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Не удалось открыть кабинет'
      );
    } finally {
      setStartingUserId(null);
    }
  };

  return (
    <MainLayout mainContainer={false} transparentMain>
      <div className='staff-applications'>
        <div className='staff-applications__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='staff-applications__header'>
            <h1 className='staff-applications__title'>Смотреть как пользователь</h1>
            <div className='staff-applications__filters'>
              <input
                className='staff-applications__search'
                type='search'
                placeholder='Поиск по ФИО или email'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {actionError ? (
            <p className='staff-applications__error'>{actionError}</p>
          ) : null}

          {isLoading ? (
            <Preloader />
          ) : loadError ? (
            <p className='staff-applications__error'>{loadError}</p>
          ) : (
            <div className='staff-applications__table-wrap'>
              <table className='staff-applications__table'>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={4} className='staff-applications__empty'>
                        Пользователи не найдены
                      </td>
                    </tr>
                  ) : (
                    results.map((item) => (
                      <tr key={item.id}>
                        <td>{item.full_name || '—'}</td>
                        <td>{item.email}</td>
                        <td>{ROLE_LABELS[item.role] || item.role}</td>
                        <td>
                          <Button
                            text={
                              startingUserId === item.id
                                ? 'Открытие…'
                                : 'Открыть кабинет'
                            }
                            color='primary'
                            onClick={() => handleStartViewAs(item.id)}
                            disabled={startingUserId !== null}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffViewAs;
