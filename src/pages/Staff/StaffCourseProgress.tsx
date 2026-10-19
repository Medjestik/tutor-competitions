import type { FC, KeyboardEvent } from 'react';
import type {
  IStaffCourseProgressDetail,
  IStaffCourseProgressListItem,
  IStaffLearningStream,
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
import sortArrowIcon from '../../shared/icons/arrow.svg';
import {
  assignStaffLearningStream,
  createStaffLearningStream,
  creditStaffCoursePart,
  deleteStaffLearningStream,
  getStaffCourseProgressDetail,
  exportStaffCourseProgressReport,
  getStaffCourseProgressList,
  getStaffLearningStreams,
  getStaffProgressCourses,
  updateStaffCourseLearningOutcome,
  updateStaffLearningStream,
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

const OUTCOME_LABELS: Record<string, string> = {
  passed: 'Зачтён',
  failed: 'Не зачтён',
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

type TSortField =
  | 'fullName'
  | 'workplace'
  | 'phone'
  | 'streamEndsAt'
  | 'testsPassed'
  | 'tasksCredited'
  | 'courseStatus';

const SORTABLE_COLUMNS: { field: TSortField; label: string }[] = [
  { field: 'fullName', label: 'ФИО' },
  { field: 'workplace', label: 'ВУЗ' },
  { field: 'phone', label: 'Телефон' },
  { field: 'streamEndsAt', label: 'Окончание доступа (LMS)' },
  { field: 'testsPassed', label: 'Тесты' },
  { field: 'tasksCredited', label: 'Задания' },
  { field: 'courseStatus', label: 'Статус' },
];

const formatStreamEndsAt = (value: string | null | undefined): string => {
  if (!value) {
    return '—';
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return value;
  }
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
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
  const [sortField, setSortField] = useState<TSortField | null>(null);
  const [sortDesc, setSortDesc] = useState(false);
  const [streamEndsFrom, setStreamEndsFrom] = useState('');
  const [streamEndsTo, setStreamEndsTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [wantsOriginalOnly, setWantsOriginalOnly] = useState(false);
  const [outcomeDraft, setOutcomeDraft] = useState<'passed' | 'failed' | ''>('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isSavingOutcome, setIsSavingOutcome] = useState(false);
  const [learningStreams, setLearningStreams] = useState<IStaffLearningStream[]>([]);
  const [learningStreamFilter, setLearningStreamFilter] = useState<'' | 'none' | number>('');
  const [isStreamsModalOpen, setIsStreamsModalOpen] = useState(false);
  const [streamFormName, setStreamFormName] = useState('');
  const [streamFormStart, setStreamFormStart] = useState('');
  const [streamFormEnd, setStreamFormEnd] = useState('');
  const [editingStreamId, setEditingStreamId] = useState<number | null>(null);
  const [streamsError, setStreamsError] = useState('');
  const [assigningUserId, setAssigningUserId] = useState<number | null>(null);

  const ordering =
    sortField === null ? undefined : `${sortDesc ? '-' : ''}${sortField}`;

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

  const loadLearningStreams = useCallback(async () => {
    if (courseId === '') {
      setLearningStreams([]);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      const items = await getStaffLearningStreams(token, courseId);
      setLearningStreams(items);
    } catch {
      setLearningStreams([]);
    }
  }, [courseId]);

  useEffect(() => {
    loadLearningStreams();
  }, [loadLearningStreams]);

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
        ordering,
        streamEndsFrom: streamEndsFrom || undefined,
        streamEndsTo: streamEndsTo || undefined,
        wantsOriginal: wantsOriginalOnly || undefined,
        learningStreamId:
          learningStreamFilter === '' ? undefined : learningStreamFilter,
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
  }, [
    courseId,
    page,
    debouncedSearch,
    statusFilter,
    ordering,
    streamEndsFrom,
    streamEndsTo,
    wantsOriginalOnly,
    learningStreamFilter,
  ]);

  useEffect(() => {
    loadListeners();
  }, [loadListeners]);

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

  const handleSortKeyDown = (field: TSortField, event: KeyboardEvent<HTMLTableCellElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSort(field);
    }
  };

  const handleExport = async () => {
    if (courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setExportError('Требуется авторизация');
      return;
    }

    setIsExporting(true);
    setExportError('');
    try {
      const blob = await exportStaffCourseProgressReport(token, courseId, {
        search: debouncedSearch,
        status: statusFilter,
        ordering,
        streamEndsFrom: streamEndsFrom || undefined,
        streamEndsTo: streamEndsTo || undefined,
        learningStreamId:
          learningStreamFilter === '' ? undefined : learningStreamFilter,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `course_progress_${courseId}.xlsx`;
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

  const sortAriaValue = (field: TSortField): 'ascending' | 'descending' | 'none' => {
    if (sortField !== field) {
      return 'none';
    }
    return sortDesc ? 'descending' : 'ascending';
  };

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
      setOutcomeDraft(
        payload.learningOutcome === 'passed' || payload.learningOutcome === 'failed'
          ? payload.learningOutcome
          : ''
      );
      setCertificateFile(null);
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
    setOutcomeDraft('');
    setCertificateFile(null);
  };

  const handleSaveOutcome = async () => {
    if (!detail || courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setFormError('Требуется авторизация');
      return;
    }

    setIsSavingOutcome(true);
    setFormError('');
    try {
      const formData = new FormData();
      if (outcomeDraft === 'passed' || outcomeDraft === 'failed') {
        formData.append('learningOutcome', outcomeDraft);
      } else {
        formData.append('learningOutcome', '');
      }
      if (certificateFile) {
        formData.append('certificateScan', certificateFile);
      }
      await updateStaffCourseLearningOutcome(token, courseId, detail.id, formData);
      const refreshed = await getStaffCourseProgressDetail(token, courseId, detail.id);
      setDetail(refreshed);
      setOutcomeDraft(
        refreshed.learningOutcome === 'passed' || refreshed.learningOutcome === 'failed'
          ? refreshed.learningOutcome
          : ''
      );
      setCertificateFile(null);
      await loadListeners();
    } catch {
      setFormError('Не удалось сохранить итог обучения');
    } finally {
      setIsSavingOutcome(false);
    }
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

  const resetStreamForm = () => {
    setStreamFormName('');
    setStreamFormStart('');
    setStreamFormEnd('');
    setEditingStreamId(null);
    setStreamsError('');
  };

  const openStreamsModal = () => {
    resetStreamForm();
    setIsStreamsModalOpen(true);
  };

  const handleSaveStream = async () => {
    if (courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setStreamsError('Требуется авторизация');
      return;
    }
    if (!streamFormName.trim() || !streamFormStart || !streamFormEnd) {
      setStreamsError('Заполните название и даты потока');
      return;
    }
    setStreamsError('');
    try {
      if (editingStreamId !== null) {
        await updateStaffLearningStream(token, courseId, editingStreamId, {
          name: streamFormName.trim(),
          startDate: streamFormStart,
          endDate: streamFormEnd,
        });
      } else {
        await createStaffLearningStream(token, courseId, {
          name: streamFormName.trim(),
          startDate: streamFormStart,
          endDate: streamFormEnd,
        });
      }
      resetStreamForm();
      await loadLearningStreams();
    } catch {
      setStreamsError('Не удалось сохранить поток');
    }
  };

  const handleEditStream = (stream: IStaffLearningStream) => {
    setEditingStreamId(stream.id);
    setStreamFormName(stream.name);
    setStreamFormStart(stream.startDate);
    setStreamFormEnd(stream.endDate);
    setStreamsError('');
  };

  const handleDeleteStream = async (streamId: number) => {
    if (courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    setStreamsError('');
    try {
      await deleteStaffLearningStream(token, courseId, streamId);
      if (editingStreamId === streamId) {
        resetStreamForm();
      }
      await loadLearningStreams();
      await loadListeners();
    } catch {
      setStreamsError('Не удалось удалить поток');
    }
  };

  const handleAssignStream = async (userId: number, value: string) => {
    if (courseId === '') {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    setAssigningUserId(userId);
    try {
      const learningStreamId = value === '' ? null : Number(value);
      await assignStaffLearningStream(token, courseId, {
        userIds: [userId],
        learningStreamId,
      });
      await loadListeners();
    } catch {
      setLoadError('Не удалось назначить поток');
    } finally {
      setAssigningUserId(null);
    }
  };

  const tableColumnCount = SORTABLE_COLUMNS.length + 6;

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
                      setLearningStreamFilter('');
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

                <label className='staff-course-progress__field'>
                  <span>Окончание с</span>
                  <input
                    type='date'
                    value={streamEndsFrom}
                    onChange={(event) => {
                      setStreamEndsFrom(event.target.value);
                      setPage(1);
                    }}
                    disabled={courseId === ''}
                  />
                </label>

                <label className='staff-course-progress__field'>
                  <span>Окончание по</span>
                  <input
                    type='date'
                    value={streamEndsTo}
                    onChange={(event) => {
                      setStreamEndsTo(event.target.value);
                      setPage(1);
                    }}
                    disabled={courseId === ''}
                  />
                </label>

                <label className='staff-course-progress__field'>
                  <span>Орг. поток</span>
                  <select
                    value={
                      learningStreamFilter === ''
                        ? ''
                        : learningStreamFilter === 'none'
                          ? 'none'
                          : String(learningStreamFilter)
                    }
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === '') {
                        setLearningStreamFilter('');
                      } else if (value === 'none') {
                        setLearningStreamFilter('none');
                      } else {
                        setLearningStreamFilter(Number(value));
                      }
                      setPage(1);
                    }}
                    disabled={courseId === ''}
                  >
                    <option value=''>Все</option>
                    <option value='none'>Без потока</option>
                    {learningStreams.map((stream) => (
                      <option key={stream.id} value={stream.id}>
                        {stream.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className='staff-course-progress__field staff-course-progress__field_checkbox'>
                  <span>Нужен оригинал</span>
                  <span className='staff-course-progress__checkbox-control'>
                    <input
                      type='checkbox'
                      checked={wantsOriginalOnly}
                      onChange={(event) => {
                        setWantsOriginalOnly(event.target.checked);
                        setPage(1);
                      }}
                      disabled={courseId === ''}
                    />
                  </span>
                </label>
              </div>

              <div className='staff-course-progress__actions'>
                <Button
                  text='Потоки'
                  color='default'
                  onClick={openStreamsModal}
                  disabled={courseId === ''}
                />
                <Button
                  text={isExporting ? 'Выгрузка…' : 'Excel: все отфильтрованные'}
                  color='primary'
                  onClick={handleExport}
                  disabled={courseId === '' || isExporting || isLoading}
                />
              </div>

              {exportError ? <p className='staff-course-progress__error'>{exportError}</p> : null}
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
                          {SORTABLE_COLUMNS.map((column) => (
                            <th
                              key={column.field}
                              className='staff-course-progress__th-sortable'
                              onClick={() => handleSort(column.field)}
                              onKeyDown={(event) => handleSortKeyDown(column.field, event)}
                              role='button'
                              tabIndex={0}
                              aria-sort={sortAriaValue(column.field)}
                            >
                              <span className='staff-course-progress__th-label'>
                                {column.label}
                                <img
                                  src={sortArrowIcon}
                                  alt=''
                                  aria-hidden='true'
                                  className={`staff-course-progress__sort-icon${
                                    sortField === column.field
                                      ? sortDesc
                                        ? ' staff-course-progress__sort-icon_desc'
                                        : ' staff-course-progress__sort-icon_asc'
                                      : ' staff-course-progress__sort-icon_idle'
                                  }`}
                                />
                              </span>
                            </th>
                          ))}
                          <th>Поток</th>
                          <th>Начало потока</th>
                          <th>Конец потока</th>
                          <th>Итог</th>
                          <th>Оригинал</th>
                          <th>Назначить поток</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listeners.length === 0 ? (
                          <tr>
                            <td colSpan={tableColumnCount} className='staff-course-progress__empty'>
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
                              <td>{item.workplace || '—'}</td>
                              <td>{item.phone || '—'}</td>
                              <td>{formatStreamEndsAt(item.streamEndsAt)}</td>
                              <td>{item.learningStreamName || '—'}</td>
                              <td>{formatStreamEndsAt(item.learningStreamStartDate)}</td>
                              <td>{formatStreamEndsAt(item.learningStreamEndDate)}</td>
                              <td>
                                {item.testsPassed}/{item.testsTotal}
                              </td>
                              <td>
                                {item.tasksCredited}/{item.tasksTotal}
                              </td>
                              <td>{STATUS_LABELS[item.courseStatus]}</td>
                              <td>
                                {item.learningOutcome
                                  ? OUTCOME_LABELS[item.learningOutcome] || item.learningOutcome
                                  : '—'}
                              </td>
                              <td>
                                {item.wantsOriginalCertificate ? 'Да' : '—'}
                              </td>
                              <td>
                                <select
                                  value={
                                    item.learningStreamId !== null &&
                                    item.learningStreamId !== undefined
                                      ? String(item.learningStreamId)
                                      : ''
                                  }
                                  onChange={(event) =>
                                    handleAssignStream(item.id, event.target.value)
                                  }
                                  disabled={assigningUserId === item.id}
                                >
                                  <option value=''>Без потока</option>
                                  {learningStreams.map((stream) => (
                                    <option key={stream.id} value={stream.id}>
                                      {stream.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
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

            <div className='staff-course-progress__outcome'>
              <h3 className='staff-course-progress__outcome-title'>Итог обучения</h3>
              <label className='staff-course-progress__field'>
                <span>Решение оргкомитета</span>
                <select
                  value={outcomeDraft}
                  onChange={(event) =>
                    setOutcomeDraft(event.target.value as 'passed' | 'failed' | '')
                  }
                >
                  <option value=''>Не задано</option>
                  <option value='passed'>Зачтён</option>
                  <option value='failed'>Не зачтён</option>
                </select>
              </label>
              {outcomeDraft === 'passed' ? (
                <label className='staff-course-progress__field'>
                  <span>Скан удостоверения</span>
                  <input
                    type='file'
                    accept='application/pdf,image/*'
                    onChange={(event) =>
                      setCertificateFile(event.target.files?.[0] ?? null)
                    }
                  />
                  {detail.hasCertificateScan ? (
                    <span className='staff-course-progress__hint'>
                      Скан уже загружен{detail.wantsOriginalCertificate ? ', нужен оригинал' : ''}
                    </span>
                  ) : null}
                </label>
              ) : null}
              {detail.learningOutcome === 'passed' && detail.wantsOriginalCertificate ? (
                <p className='staff-course-progress__hint'>
                  Слушатель запросил оригинал удостоверения
                </p>
              ) : null}
              <Button
                text={isSavingOutcome ? 'Сохранение…' : 'Сохранить итог'}
                color='primary'
                onClick={() => void handleSaveOutcome()}
                disabled={isSavingOutcome}
              />
            </div>

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

      <Popup
        isOpen={isStreamsModalOpen}
        onClose={() => {
          setIsStreamsModalOpen(false);
          resetStreamForm();
        }}
        popupWidth='full'
        closeOutside
      >
        <div className='staff-course-progress__modal'>
          <div className='staff-course-progress__modal-head'>
            <h2 className='staff-course-progress__modal-title'>Организационные потоки</h2>
            <button
              type='button'
              className='staff-course-progress__modal-close'
              aria-label='Закрыть'
              onClick={() => {
                setIsStreamsModalOpen(false);
                resetStreamForm();
              }}
            >
              <img src={closeIcon} alt='' aria-hidden='true' />
            </button>
          </div>

          <div className='staff-course-progress__filters'>
            <label className='staff-course-progress__field'>
              <span>Название</span>
              <input
                type='text'
                value={streamFormName}
                onChange={(event) => setStreamFormName(event.target.value)}
              />
            </label>
            <label className='staff-course-progress__field'>
              <span>Начало</span>
              <input
                type='date'
                value={streamFormStart}
                onChange={(event) => setStreamFormStart(event.target.value)}
              />
            </label>
            <label className='staff-course-progress__field'>
              <span>Окончание</span>
              <input
                type='date'
                value={streamFormEnd}
                onChange={(event) => setStreamFormEnd(event.target.value)}
              />
            </label>
          </div>

          <div className='staff-course-progress__actions'>
            <Button
              text={editingStreamId !== null ? 'Сохранить' : 'Создать поток'}
              color='primary'
              onClick={handleSaveStream}
            />
            {editingStreamId !== null ? (
              <Button text='Отмена редактирования' color='default' onClick={resetStreamForm} />
            ) : null}
          </div>

          {streamsError ? <p className='staff-course-progress__error'>{streamsError}</p> : null}

          <table className='staff-course-progress__table'>
            <thead>
              <tr>
                <th>Название</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {learningStreams.length === 0 ? (
                <tr>
                  <td colSpan={4} className='staff-course-progress__empty'>
                    Потоков пока нет
                  </td>
                </tr>
              ) : (
                learningStreams.map((stream) => (
                  <tr key={stream.id}>
                    <td>{stream.name}</td>
                    <td>{formatStreamEndsAt(stream.startDate)}</td>
                    <td>{formatStreamEndsAt(stream.endDate)}</td>
                    <td>
                      <Button
                        text='Изменить'
                        color='default'
                        onClick={() => handleEditStream(stream)}
                      />
                      <Button
                        text='Удалить'
                        color='default'
                        onClick={() => handleDeleteStream(stream.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Popup>
    </MainLayout>
  );
};

export default StaffCourseProgress;
