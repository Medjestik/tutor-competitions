import type { FC } from 'react';
import type {
  IStaffCourseProgressDetail,
  IStaffCourseProgressListItem,
  IStaffProgressCourseOption,
  TStaffCourseProgressStatus,
} from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import Popup from '../../shared/components/Popup/ui/Popup';
import StaffBackButton from './components/StaffBackButton';
import closeIcon from '../../shared/icons/buttons/close-color.svg';
import {
  creditStaffCoursePart,
  getStaffCourseProgressDetail,
  getStaffCourseProgressList,
  getStaffProgressCourses,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-course-progress.css';

const STATUS_OPTIONS: { value: '' | TStaffCourseProgressStatus; label: string }[] = [
  { value: '', label: 'Все статусы' },
  { value: 'not_started', label: 'Не начал' },
  { value: 'in_progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершил' },
];

const STATUS_LABELS: Record<TStaffCourseProgressStatus, string> = {
  not_started: 'Не начал',
  in_progress: 'В процессе',
  completed: 'Завершил',
};

const PART_TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  pdf: 'PDF',
  video: 'Видео',
  test: 'Тест',
  task: 'Задание',
};

const LESSON_STATUS_LABELS: Record<string, string> = {
  not_started: 'Не начато',
  in_progress: 'В процессе',
  completed: 'Зачтено',
};

const StaffCourseProgress: FC = () => {
  const [courses, setCourses] = useState<IStaffProgressCourseOption[]>([]);
  const [courseId, setCourseId] = useState<number | ''>('');
  const [listeners, setListeners] = useState<IStaffCourseProgressListItem[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | TStaffCourseProgressStatus>('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [detail, setDetail] = useState<IStaffCourseProgressDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [creditingPartId, setCreditingPartId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadError('Требуется авторизация');
      setIsCoursesLoading(false);
      return;
    }

    setIsCoursesLoading(true);
    getStaffProgressCourses(token)
      .then((items) => {
        setCourses(items);
        setLoadError('');
      })
      .catch(() => {
        setLoadError('Не удалось загрузить список курсов');
        setCourses([]);
      })
      .finally(() => setIsCoursesLoading(false));
  }, []);

  const loadListeners = useCallback(async () => {
    if (courseId === '') {
      setListeners([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoadError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError('');

    try {
      const response = await getStaffCourseProgressList(token, courseId, {
        page,
        search: debouncedSearch,
        status: statusFilter,
      });
      setListeners(response.results);
      setTotalCount(response.count);
      setHasNext(Boolean(response.next));
      setHasPrevious(Boolean(response.previous));
    } catch {
      setLoadError('Не удалось загрузить прогресс слушателей');
      setListeners([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, page, debouncedSearch, statusFilter]);

  useEffect(() => {
    loadListeners();
  }, [loadListeners]);

  const openDetail = async (userId: number) => {
    if (courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsDetailLoading(true);
    setFormError('');
    try {
      const payload = await getStaffCourseProgressDetail(token, courseId, userId);
      setDetail(payload);
    } catch {
      setFormError('Не удалось загрузить уроки слушателя');
      setDetail(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setDetail(null);
    setFormError('');
    setCreditingPartId(null);
  };

  const handleCredit = async (partId: number) => {
    if (!detail || courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setFormError('Требуется авторизация');
      return;
    }

    setCreditingPartId(partId);
    setFormError('');
    try {
      await creditStaffCoursePart(token, courseId, detail.id, partId);
      const refreshed = await getStaffCourseProgressDetail(token, courseId, detail.id);
      setDetail(refreshed);
      await loadListeners();
    } catch {
      setFormError('Не удалось зачесть урок');
    } finally {
      setCreditingPartId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / 20));

  return (
    <MainLayout mainContainer={false} transparentMain>
      <div className='staff-course-progress'>
        <div className='staff-course-progress__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <h1 className='staff-course-progress__title'>Прогресс курса</h1>

          {isCoursesLoading ? (
            <Preloader />
          ) : (
            <>
              <div className='staff-course-progress__filters'>
                <label className='staff-course-progress__field'>
                  <span>Курс</span>
                  <select
                    value={courseId === '' ? '' : String(courseId)}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCourseId(value ? Number(value) : '');
                      setPage(1);
                      closeModal();
                    }}
                  >
                    <option value=''>Выберите курс</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className='staff-course-progress__field'>
                  <span>Поиск по ФИО</span>
                  <input
                    type='search'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Фамилия, имя...'
                    disabled={courseId === ''}
                  />
                </label>

                <label className='staff-course-progress__field'>
                  <span>Статус курса</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value as '' | TStaffCourseProgressStatus);
                      setPage(1);
                    }}
                    disabled={courseId === ''}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value || 'all'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {loadError ? <p className='staff-course-progress__error'>{loadError}</p> : null}

              {courseId === '' ? (
                <p className='staff-course-progress__hint'>Выберите курс, чтобы увидеть слушателей.</p>
              ) : null}

              {courseId !== '' && isLoading ? <Preloader /> : null}

              {courseId !== '' && !isLoading ? (
                <>
                  <div className='staff-course-progress__table-wrap'>
                    <table className='staff-course-progress__table'>
                      <thead>
                        <tr>
                          <th>ФИО</th>
                          <th>Телефон</th>
                          <th>Тесты</th>
                          <th>Задания</th>
                          <th>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listeners.length === 0 ? (
                          <tr>
                            <td colSpan={5} className='staff-course-progress__empty'>
                              Слушатели не найдены
                            </td>
                          </tr>
                        ) : (
                          listeners.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <button
                                  type='button'
                                  className='staff-course-progress__name-btn'
                                  onClick={() => openDetail(item.id)}
                                >
                                  {item.fullName || '—'}
                                </button>
                              </td>
                              <td>{item.phone || '—'}</td>
                              <td>
                                {item.testsPassed}/{item.testsTotal}
                              </td>
                              <td>
                                {item.tasksCredited}/{item.tasksTotal}
                              </td>
                              <td>{STATUS_LABELS[item.courseStatus]}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className='staff-course-progress__pagination'>
                    <Button
                      text='Назад'
                      color='primary'
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={!hasPrevious}
                    />
                    <span className='staff-course-progress__page-info'>
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
              ) : null}
            </>
          )}
        </div>
      </div>

      <Popup
        isOpen={Boolean(detail) || isDetailLoading}
        onClose={closeModal}
        popupWidth='full'
        closeOutside
      >
        {isDetailLoading ? <Preloader /> : null}
        {!isDetailLoading && detail ? (
          <div className='staff-course-progress__modal'>
            <div className='staff-course-progress__modal-head'>
              <h2 className='staff-course-progress__modal-title'>{detail.fullName}</h2>
              <button
                type='button'
                className='staff-course-progress__modal-close'
                aria-label='Закрыть'
                onClick={closeModal}
              >
                <img src={closeIcon} alt='' aria-hidden='true' />
              </button>
            </div>
            <p className='staff-course-progress__modal-phone'>
              Телефон: {detail.phone || '—'}
            </p>

            <div className='staff-course-progress__table-wrap'>
              <table className='staff-course-progress__table'>
                <thead>
                  <tr>
                    <th>Урок</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {detail.lessons.map((lesson) => {
                    const isCompleted = lesson.status === 'completed';
                    return (
                      <tr key={lesson.id}>
                        <td>{lesson.title}</td>
                        <td>{PART_TYPE_LABELS[lesson.partType] || lesson.partType}</td>
                        <td>{LESSON_STATUS_LABELS[lesson.status] || lesson.status}</td>
                        <td>
                          {isCompleted ? (
                            '—'
                          ) : (
                            <Button
                              text={creditingPartId === lesson.id ? 'Зачёт...' : 'Зачесть'}
                              color='primary'
                              onClick={() => handleCredit(lesson.id)}
                              disabled={creditingPartId !== null}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {formError ? <p className='staff-course-progress__error'>{formError}</p> : null}
          </div>
        ) : null}
      </Popup>
    </MainLayout>
  );
};

export default StaffCourseProgress;
