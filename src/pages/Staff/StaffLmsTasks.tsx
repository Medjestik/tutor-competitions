import type { FC } from 'react';
import type { ILmsTask } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import { createLmsTask, deleteLmsTask, getLmsTasks } from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

interface IStaffLmsTasksProps {
  windowWidth: number;
  onLogout: () => void;
}

const StaffLmsTasks: FC<IStaffLmsTasksProps> = ({ windowWidth, onLogout }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ILmsTask[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setTasks(await getLmsTasks(token, debouncedSearch));
    } catch {
      setError('Не удалось загрузить задания');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsCreating(true);
    try {
      const task = await createLmsTask(token, {
        name: 'Новое задание',
        description: 'Опишите условие задания',
      });
      navigate(`/staff/lms/tasks/${task.id}`);
    } catch {
      setError('Не удалось создать задание');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!window.confirm('Удалить задание?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteLmsTask(token, taskId);
      setTasks((prev) => prev.filter((item) => item.id !== taskId));
    } catch {
      setError('Не удалось удалить задание');
    }
  };

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
      windowWidth={windowWidth}
      isLoggedIn
      onLogout={onLogout}
    >
      <div className='staff-lms'>
        <div className='staff-lms__card'>
          <StaffBackButton fallbackTo={EROUTES.STAFF_LMS} />
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.STAFF_LMS}>Конструктор LMS</Link>
            {' / Задания'}
          </div>
          <div className='staff-lms__header'>
            <h1 className='staff-lms__title'>Задания</h1>
            <div className='staff-lms__actions'>
              <input
                className='staff-lms__search'
                type='search'
                placeholder='Поиск'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                text={isCreating ? 'Создание…' : 'Создать задание'}
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
          ) : tasks.length === 0 ? (
            <p className='staff-lms__empty'>Заданий пока нет</p>
          ) : (
            <div className='staff-lms__table-wrap'>
              <table className='staff-lms__table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>
                        <Link
                          className='staff-lms__row-link'
                          to={`/staff/lms/tasks/${task.id}`}
                        >
                          {task.name}
                        </Link>
                      </td>
                      <td>
                        <button
                          type='button'
                          className='staff-lms__ghost-btn staff-lms__danger'
                          onClick={() => handleDelete(task.id)}
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

export default StaffLmsTasks;
