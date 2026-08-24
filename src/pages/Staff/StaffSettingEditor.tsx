import type { FC } from 'react';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import {
  deleteStaffSetting,
  getStaffSetting,
  updateStaffSetting,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

interface IStaffSettingEditorProps {
  windowWidth: number;
  onLogout: () => void;
}

const StaffSettingEditor: FC<IStaffSettingEditorProps> = ({
  windowWidth,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const settingId = Number(id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [keyName, setKeyName] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !settingId) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getStaffSetting(token, settingId)
      .then((setting) => {
        setKeyName(setting.key);
        setValue(setting.value || '');
      })
      .catch(() => setError('Не удалось загрузить настройку'))
      .finally(() => setIsLoading(false));
  }, [settingId]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const updated = await updateStaffSetting(token, settingId, {
        key: keyName,
        value,
      });
      setKeyName(updated.key);
      setValue(updated.value || '');
      setMessage('Настройка сохранена');
    } catch {
      setError('Не удалось сохранить настройку');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить настройку?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteStaffSetting(token, settingId);
      navigate(EROUTES.STAFF_SETTINGS);
    } catch {
      setError('Не удалось удалить настройку');
      setIsDeleting(false);
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
          <StaffBackButton fallbackTo={EROUTES.STAFF_SETTINGS} />
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.STAFF_SETTINGS}>Settings</Link>
            {' / Редактор'}
          </div>

          {isLoading ? (
            <Preloader />
          ) : (
            <>
              <div className='staff-lms__header'>
                <h1 className='staff-lms__title'>Редактор настройки</h1>
                <div className='staff-lms__actions'>
                  <Button
                    text={isSaving ? 'Сохранение…' : 'Сохранить'}
                    type='button'
                    color='primary'
                    onClick={handleSave}
                    disabled={isSaving || isDeleting}
                  />
                  <button
                    type='button'
                    className='staff-lms__ghost-btn staff-lms__danger'
                    onClick={handleDelete}
                    disabled={isDeleting || isSaving}
                  >
                    {isDeleting ? 'Удаление…' : 'Удалить'}
                  </button>
                </div>
              </div>

              <div className='staff-lms__form'>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label' htmlFor='staff-setting-key'>Ключ</label>
                  <input
                    id='staff-setting-key'
                    className='staff-lms__input'
                    value={keyName}
                    onChange={(event) => setKeyName(event.target.value)}
                  />
                </div>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label' htmlFor='staff-setting-value'>Значение</label>
                  <textarea
                    id='staff-setting-value'
                    className='staff-lms__textarea'
                    style={{ minHeight: 200 }}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
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

export default StaffSettingEditor;
