import type { FC } from 'react';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import { getLmsTask, updateLmsTask } from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

interface IStaffLmsTaskEditorProps {
  windowWidth: number;
  onLogout: () => void;
}

const StaffLmsTaskEditor: FC<IStaffLmsTaskEditorProps> = ({
  windowWidth,
  onLogout,
}) => {
  const { id } = useParams();
  const taskId = Number(id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !taskId) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getLmsTask(token, taskId)
      .then((task) => {
        setName(task.name);
        setDescription(task.description || '');
      })
      .catch(() => setError('Не удалось загрузить задание'))
      .finally(() => setIsLoading(false));
  }, [taskId]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      await updateLmsTask(token, taskId, { name, description });
      setMessage('Задание сохранено');
    } catch {
      setError('Не удалось сохранить задание');
    } finally {
      setIsSaving(false);
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
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.STAFF_LMS}>Конструктор LMS</Link>
            {' / '}
            <Link to={EROUTES.STAFF_LMS_TASKS}>Задания</Link>
            {' / Редактор'}
          </div>

          {isLoading ? (
            <Preloader />
          ) : (
            <>
              <div className='staff-lms__header'>
                <h1 className='staff-lms__title'>Редактор задания</h1>
                <Button
                  text={isSaving ? 'Сохранение…' : 'Сохранить'}
                  type='button'
                  color='primary'
                  onClick={handleSave}
                  disabled={isSaving}
                />
              </div>

              <div className='staff-lms__form'>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Название</label>
                  <input
                    className='staff-lms__input'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Описание / условие</label>
                  <textarea
                    className='staff-lms__textarea'
                    style={{ minHeight: 200 }}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
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

export default StaffLmsTaskEditor;
