import type { FC } from 'react';
import type { ILmsCourse } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import { createLmsCourse, deleteLmsCourse, getLmsCourses } from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

const StaffLmsCourses: FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ILmsCourse[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCourses = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const data = await getLmsCourses(token, debouncedSearch);
      setCourses(data);
    } catch {
      setError('Не удалось загрузить курсы');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsCreating(true);
    try {
      const course = await createLmsCourse(token, {
        name: 'Новый курс',
        description: '',
        is_published: false,
      });
      navigate(`/staff/lms/courses/${course.id}`);
    } catch {
      setError('Не удалось создать курс');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!window.confirm('Удалить курс и все его части?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteLmsCourse(token, courseId);
      setCourses((prev) => prev.filter((item) => item.id !== courseId));
    } catch {
      setError('Не удалось удалить курс');
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
            {' / Курсы'}
          </div>
          <div className='staff-lms__header'>
            <h1 className='staff-lms__title'>Курсы</h1>
            <div className='staff-lms__actions'>
              <input
                className='staff-lms__search'
                type='search'
                placeholder='Поиск'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                text={isCreating ? 'Создание…' : 'Создать курс'}
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
          ) : courses.length === 0 ? (
            <p className='staff-lms__empty'>Курсов пока нет</p>
          ) : (
            <div className='staff-lms__table-wrap'>
              <table className='staff-lms__table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Опубликован</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>
                        <Link
                          className='staff-lms__row-link'
                          to={`/staff/lms/courses/${course.id}`}
                        >
                          {course.name}
                        </Link>
                      </td>
                      <td>{course.is_published ? 'Да' : 'Нет'}</td>
                      <td>
                        <button
                          type='button'
                          className='staff-lms__ghost-btn staff-lms__danger'
                          onClick={() => handleDelete(course.id)}
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

export default StaffLmsCourses;
