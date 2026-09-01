import type { FC } from 'react';
import type { ILmsTest } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import { createLmsTest, deleteLmsTest, getLmsTests } from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

const StaffLmsTests: FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<ILmsTest[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadTests = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setTests(await getLmsTests(token, debouncedSearch));
    } catch {
      setError('Не удалось загрузить тесты');
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsCreating(true);
    try {
      const test = await createLmsTest(token, {
        name: 'Новый тест',
        description: '',
        pass_score: 70,
        max_attempts: 99,
        questions: [],
      });
      navigate(`/staff/lms/tests/${test.id}`);
    } catch {
      setError('Не удалось создать тест');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (testId: number) => {
    if (!window.confirm('Удалить тест?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteLmsTest(token, testId);
      setTests((prev) => prev.filter((item) => item.id !== testId));
    } catch {
      setError('Не удалось удалить тест');
    }
  };

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
    >
      <div className='staff-lms'>
        <div className='staff-lms__card'>
          <StaffBackButton fallbackTo={EROUTES.STAFF_LMS} />
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.STAFF_LMS}>Конструктор LMS</Link>
            {' / Тесты'}
          </div>
          <div className='staff-lms__header'>
            <h1 className='staff-lms__title'>Тесты</h1>
            <div className='staff-lms__actions'>
              <input
                className='staff-lms__search'
                type='search'
                placeholder='Поиск'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                text={isCreating ? 'Создание…' : 'Создать тест'}
                type='button'
                color='primary'
                onClick={handleCreate}
                disabled={isCreating}
              />
            </div>
          </div>

          {isLoading ? (
            <Preloader />
          ) : error ? (
            <p className='staff-lms__error'>{error}</p>
          ) : tests.length === 0 ? (
            <p className='staff-lms__empty'>Тестов пока нет</p>
          ) : (
            <div className='staff-lms__table-wrap'>
              <table className='staff-lms__table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Вопросов</th>
                    <th>Порог %</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td>{test.id}</td>
                      <td>
                        <Link
                          className='staff-lms__row-link'
                          to={`/staff/lms/tests/${test.id}`}
                        >
                          {test.name}
                        </Link>
                      </td>
                      <td>{test.questions_count ?? 0}</td>
                      <td>{test.pass_score ?? '—'}</td>
                      <td>
                        <button
                          type='button'
                          className='staff-lms__ghost-btn staff-lms__danger'
                          onClick={() => handleDelete(test.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffLmsTests;
