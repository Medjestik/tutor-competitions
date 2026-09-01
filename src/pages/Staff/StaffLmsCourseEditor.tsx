import type { FC } from 'react';
import type {
  ILmsCourseDetail,
  ILmsCoursePart,
  ILmsPartType,
  ILmsTask,
  ILmsTest,
} from '../../shared/utils/api';

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import {
  createLmsCoursePart,
  deleteLmsCoursePart,
  getLmsCourse,
  getLmsPartTypes,
  getLmsTasks,
  getLmsTests,
  updateLmsCourse,
  updateLmsCoursePart,
  updateLmsTest,
  uploadLmsCoursePartFile,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

const sortParts = (parts: ILmsCoursePart[]) =>
  [...parts].sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    if (a.position !== b.position) return a.position - b.position;
    return a.id - b.id;
  });

const buildTreeOrder = (parts: ILmsCoursePart[]): ILmsCoursePart[] => {
  const byParent = new Map<number | null, ILmsCoursePart[]>();
  parts.forEach((part) => {
    const key = part.parent_id ?? null;
    const list = byParent.get(key) || [];
    list.push(part);
    byParent.set(key, list);
  });
  byParent.forEach((list) => list.sort((a, b) => a.position - b.position));

  const result: ILmsCoursePart[] = [];
  const walk = (parentId: number | null) => {
    const children = byParent.get(parentId) || [];
    children.forEach((child) => {
      result.push(child);
      walk(child.id);
    });
  };
  walk(null);
  return result;
};

const StaffLmsCourseEditor: FC = () => {
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<ILmsCourseDetail | null>(null);
  const [partTypes, setPartTypes] = useState<ILmsPartType[]>([]);
  const [tests, setTests] = useState<ILmsTest[]>([]);
  const [tasks, setTasks] = useState<ILmsTask[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [isSavingPart, setIsSavingPart] = useState(false);

  const [metaName, setMetaName] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaPublished, setMetaPublished] = useState(false);

  const [partName, setPartName] = useState('');
  const [partTypeId, setPartTypeId] = useState<number | ''>('');
  const [partLevel, setPartLevel] = useState(0);
  const [partPosition, setPartPosition] = useState(0);
  const [partMandatory, setPartMandatory] = useState(true);
  const [partText, setPartText] = useState('');
  const [partTestId, setPartTestId] = useState<number | ''>('');
  const [partTestMaxAttempts, setPartTestMaxAttempts] = useState<number | ''>(99);
  const [partTaskId, setPartTaskId] = useState<number | ''>('');
  const [partFileUrl, setPartFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token || !courseId) {
        setError('Требуется авторизация');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const [courseData, typesData, testsData, tasksData] = await Promise.all([
          getLmsCourse(token, courseId),
          getLmsPartTypes(token),
          getLmsTests(token),
          getLmsTasks(token),
        ]);
        setCourse(courseData);
        setPartTypes(typesData);
        setTests(testsData);
        setTasks(tasksData);
        setMetaName(courseData.name);
        setMetaDescription(courseData.description || '');
        setMetaPublished(courseData.is_published);
        setSelectedPartId((current) =>
          current === null && courseData.parts.length
            ? courseData.parts[0].id
            : current
        );
      } catch {
        setError('Не удалось загрузить курс');
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [courseId]);

  const orderedParts = useMemo(
    () => (course ? buildTreeOrder(sortParts(course.parts)) : []),
    [course]
  );

  const selectedPart = useMemo(
    () => orderedParts.find((part) => part.id === selectedPartId) || null,
    [orderedParts, selectedPartId]
  );

  const selectedTypeCode = useMemo(() => {
    if (!selectedPart) return '';
    if (partTypeId) {
      return partTypes.find((type) => type.id === partTypeId)?.code || '';
    }
    return selectedPart.part_type.code;
  }, [selectedPart, partTypeId, partTypes]);

  useEffect(() => {
    if (!selectedPart) return;
    setPartName(selectedPart.name);
    setPartTypeId(selectedPart.part_type.id);
    setPartLevel(selectedPart.level);
    setPartPosition(selectedPart.position);
    setPartMandatory(selectedPart.is_mandatory);
    setPartText(selectedPart.text || '');
    setPartTestId(selectedPart.test_id ?? '');
    setPartTaskId(selectedPart.task_id ?? '');
    setPartFileUrl(selectedPart.file_url);
  }, [selectedPart]);

  useEffect(() => {
    if (partTestId === '') {
      setPartTestMaxAttempts(99);
      return;
    }
    const selectedTest = tests.find((test) => test.id === partTestId);
    setPartTestMaxAttempts(selectedTest?.max_attempts ?? 99);
  }, [partTestId, tests]);

  const refreshCourse = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const courseData = await getLmsCourse(token, courseId);
    setCourse(courseData);
  };

  const handleSaveMeta = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsSavingMeta(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateLmsCourse(token, courseId, {
        name: metaName,
        description: metaDescription,
        is_published: metaPublished,
      });
      setCourse(updated);
      setMessage('Метаданные курса сохранены');
    } catch {
      setError('Не удалось сохранить курс');
    } finally {
      setIsSavingMeta(false);
    }
  };

  const handleAddPart = async (asChild: boolean) => {
    const token = localStorage.getItem('token');
    if (!token || !course) return;
    const folderType = partTypes.find((type) => type.code === 'folder');
    const defaultType = folderType || partTypes[0];
    if (!defaultType) {
      setError('Типы частей не загружены');
      return;
    }

    const parentId = asChild && selectedPart ? selectedPart.id : selectedPart?.parent_id ?? null;
    const level = asChild && selectedPart ? selectedPart.level + 1 : selectedPart?.level ?? 0;
    const siblings = course.parts.filter((part) => (part.parent_id ?? null) === parentId);
    const position = siblings.length;

    try {
      const part = await createLmsCoursePart(token, courseId, {
        name: asChild ? 'Новая вложенная часть' : 'Новая часть',
        part_type_id: defaultType.id,
        level,
        position,
        parent_id: parentId,
        is_mandatory: true,
        text: '',
      });
      await refreshCourse();
      setSelectedPartId(part.id);
      setMessage('Часть добавлена');
    } catch {
      setError('Не удалось добавить часть');
    }
  };

  const handleSavePart = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedPart || partTypeId === '') return;
    setIsSavingPart(true);
    setError('');
    setMessage('');
    try {
      await updateLmsCoursePart(token, selectedPart.id, {
        name: partName,
        part_type_id: partTypeId,
        level: partLevel,
        position: partPosition,
        is_mandatory: partMandatory,
        text: partText,
        test_id: partTestId === '' ? null : partTestId,
        task_id: partTaskId === '' ? null : partTaskId,
      });
      if (selectedTypeCode === 'test' && partTestId !== '') {
        const maxAttempts =
          partTestMaxAttempts === '' ? 99 : Number(partTestMaxAttempts);
        await updateLmsTest(token, partTestId, { max_attempts: maxAttempts });
        setTests((prev) =>
          prev.map((test) =>
            test.id === partTestId
              ? { ...test, max_attempts: maxAttempts }
              : test
          )
        );
      }
      await refreshCourse();
      setMessage('Часть сохранена');
    } catch {
      setError('Не удалось сохранить часть');
    } finally {
      setIsSavingPart(false);
    }
  };

  const handleDeletePart = async () => {
    if (!selectedPart || !window.confirm('Удалить эту часть?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteLmsCoursePart(token, selectedPart.id);
      setSelectedPartId(null);
      await refreshCourse();
      setMessage('Часть удалена');
    } catch {
      setError('Не удалось удалить часть');
    }
  };

  const handleUpload = async (file: File | null) => {
    if (!file || !selectedPart) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const updated = await uploadLmsCoursePartFile(token, selectedPart.id, file);
      setPartFileUrl(updated.file_url);
      await refreshCourse();
      setMessage('Файл загружен');
    } catch {
      setError('Не удалось загрузить файл');
    }
  };

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
    >
      <div className='staff-lms'>
        <div className='staff-lms__card'>
          <StaffBackButton fallbackTo={EROUTES.STAFF_LMS_COURSES} />
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.STAFF_LMS}>Конструктор LMS</Link>
            {' / '}
            <Link to={EROUTES.STAFF_LMS_COURSES}>Курсы</Link>
            {' / Редактор'}
          </div>

          {isLoading ? (
            <Preloader />
          ) : !course ? (
            <p className='staff-lms__error'>{error || 'Курс не найден'}</p>
          ) : (
            <>
              <div className='staff-lms__header'>
                <h1 className='staff-lms__title'>Курс: {course.name}</h1>
              </div>

              <div className='staff-lms__form' style={{ marginBottom: 24 }}>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Название</label>
                  <input
                    className='staff-lms__input'
                    value={metaName}
                    onChange={(event) => setMetaName(event.target.value)}
                  />
                </div>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Описание</label>
                  <textarea
                    className='staff-lms__textarea'
                    value={metaDescription}
                    onChange={(event) => setMetaDescription(event.target.value)}
                  />
                </div>
                <label className='staff-lms__checkbox'>
                  <input
                    type='checkbox'
                    checked={metaPublished}
                    onChange={(event) => setMetaPublished(event.target.checked)}
                  />
                  Опубликован
                </label>
                <div className='staff-lms__btn-row'>
                  <Button
                    text={isSavingMeta ? 'Сохранение…' : 'Сохранить курс'}
                    type='button'
                    color='primary'
                    onClick={handleSaveMeta}
                    disabled={isSavingMeta}
                  />
                </div>
              </div>

              <div className='staff-lms__btn-row' style={{ marginBottom: 12 }}>
                <button
                  type='button'
                  className='staff-lms__ghost-btn'
                  onClick={() => handleAddPart(false)}
                >
                  + Часть
                </button>
                <button
                  type='button'
                  className='staff-lms__ghost-btn'
                  onClick={() => handleAddPart(true)}
                  disabled={!selectedPart}
                >
                  + Дочерняя часть
                </button>
              </div>

              <div className='staff-lms__layout'>
                <div className='staff-lms__tree'>
                  {orderedParts.length === 0 ? (
                    <p className='staff-lms__empty'>Частей пока нет</p>
                  ) : (
                    orderedParts.map((part) => (
                      <button
                        key={part.id}
                        type='button'
                        className={`staff-lms__tree-item${
                          part.id === selectedPartId
                            ? ' staff-lms__tree-item_active'
                            : ''
                        }`}
                        style={{ paddingLeft: 10 + part.level * 16 }}
                        onClick={() => setSelectedPartId(part.id)}
                      >
                        <span>{part.name}</span>
                        <span className='staff-lms__tree-meta'>
                          {part.part_type.name}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                <div className='staff-lms__panel'>
                  {!selectedPart ? (
                    <p className='staff-lms__empty'>Выберите часть курса</p>
                  ) : (
                    <>
                      <h2 className='staff-lms__panel-title'>Часть #{selectedPart.id}</h2>
                      <div className='staff-lms__form'>
                        <div className='staff-lms__field'>
                          <label className='staff-lms__label'>Название</label>
                          <input
                            className='staff-lms__input'
                            value={partName}
                            onChange={(event) => setPartName(event.target.value)}
                          />
                        </div>
                        <div className='staff-lms__field'>
                          <label className='staff-lms__label'>Тип</label>
                          <select
                            className='staff-lms__select'
                            value={partTypeId}
                            onChange={(event) =>
                              setPartTypeId(Number(event.target.value))
                            }
                          >
                            {partTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='staff-lms__field'>
                          <label className='staff-lms__label'>Уровень</label>
                          <input
                            className='staff-lms__input'
                            type='number'
                            min={0}
                            value={partLevel}
                            onChange={(event) =>
                              setPartLevel(Number(event.target.value))
                            }
                          />
                        </div>
                        <div className='staff-lms__field'>
                          <label className='staff-lms__label'>Позиция</label>
                          <input
                            className='staff-lms__input'
                            type='number'
                            min={0}
                            value={partPosition}
                            onChange={(event) =>
                              setPartPosition(Number(event.target.value))
                            }
                          />
                        </div>
                        <label className='staff-lms__checkbox'>
                          <input
                            type='checkbox'
                            checked={partMandatory}
                            onChange={(event) =>
                              setPartMandatory(event.target.checked)
                            }
                          />
                          Обязателен для прохождения
                        </label>

                        {selectedTypeCode === 'text' && (
                          <div className='staff-lms__field'>
                            <label className='staff-lms__label'>Текст</label>
                            <textarea
                              className='staff-lms__textarea'
                              value={partText}
                              onChange={(event) => setPartText(event.target.value)}
                            />
                          </div>
                        )}

                        {selectedTypeCode === 'slider' && (
                          <div className='staff-lms__field'>
                            <label className='staff-lms__label'>PDF-слайдер</label>
                            {partFileUrl && (
                              <a
                                href={partFileUrl}
                                target='_blank'
                                rel='noreferrer'
                                className='staff-lms__row-link'
                              >
                                Открыть текущий файл
                              </a>
                            )}
                            <input
                              type='file'
                              accept='application/pdf,.pdf'
                              onChange={(event) =>
                                handleUpload(event.target.files?.[0] || null)
                              }
                            />
                          </div>
                        )}

                        {selectedTypeCode === 'test' && (
                          <>
                            <div className='staff-lms__field'>
                              <label className='staff-lms__label'>Тест</label>
                              <select
                                className='staff-lms__select'
                                value={partTestId}
                                onChange={(event) =>
                                  setPartTestId(
                                    event.target.value
                                      ? Number(event.target.value)
                                      : ''
                                  )
                                }
                              >
                                <option value=''>— не выбран —</option>
                                {tests.map((test) => (
                                  <option key={test.id} value={test.id}>
                                    {test.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {partTestId !== '' && (
                              <div className='staff-lms__field'>
                                <label className='staff-lms__label'>
                                  Максимум попыток
                                </label>
                                <input
                                  className='staff-lms__input'
                                  type='number'
                                  min={1}
                                  value={partTestMaxAttempts}
                                  onChange={(event) =>
                                    setPartTestMaxAttempts(
                                      event.target.value === ''
                                        ? ''
                                        : Number(event.target.value)
                                    )
                                  }
                                />
                              </div>
                            )}
                          </>
                        )}

                        {selectedTypeCode === 'task' && (
                          <div className='staff-lms__field'>
                            <label className='staff-lms__label'>Задание</label>
                            <select
                              className='staff-lms__select'
                              value={partTaskId}
                              onChange={(event) =>
                                setPartTaskId(
                                  event.target.value
                                    ? Number(event.target.value)
                                    : ''
                                )
                              }
                            >
                              <option value=''>— не выбрано —</option>
                              {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                  {task.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className='staff-lms__btn-row'>
                          <Button
                            text={isSavingPart ? 'Сохранение…' : 'Сохранить часть'}
                            type='button'
                            color='primary'
                            onClick={handleSavePart}
                            disabled={isSavingPart}
                          />
                          <button
                            type='button'
                            className='staff-lms__ghost-btn staff-lms__danger'
                            onClick={handleDeletePart}
                          >
                            Удалить часть
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {message && <p className='staff-lms__success'>{message}</p>}
              {error && <p className='staff-lms__error'>{error}</p>}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffLmsCourseEditor;
