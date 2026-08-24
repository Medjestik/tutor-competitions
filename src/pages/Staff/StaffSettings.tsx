import type { FC } from 'react';
import type { IStaffSetting } from '../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import StaffBackButton from './components/StaffBackButton';
import {
  createStaffSetting,
  deleteStaffSetting,
  getStaffSettings,
} from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

interface IStaffSettingsProps {
  windowWidth: number;
  onLogout: () => void;
}

const StaffSettings: FC<IStaffSettingsProps> = ({ windowWidth, onLogout }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<IStaffSetting[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadSettings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      setSettings(await getStaffSettings(token, debouncedSearch));
    } catch {
      setError('Не удалось загрузить настройки');
      setSettings([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  let content = <Preloader />;

  if (!isLoading) {
    if (error) {
      content = <p className='staff-lms__error'>{error}</p>;
    } else if (settings.length === 0) {
      content = <p className='staff-lms__empty'>Настройки не найдены</p>;
    } else {
      content = (
        <div className='staff-lms__table-wrap'>
          <table className='staff-lms__table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ключ</th>
                <th>Значение</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr key={setting.id}>
                  <td>{setting.id}</td>
                  <td>
                    <Link
                      className='staff-lms__row-link'
                      to={EROUTES.STAFF_SETTING.replace(':id', String(setting.id))}
                    >
                      {setting.key}
                    </Link>
                  </td>
                  <td>{setting.value || '—'}</td>
                  <td>
                    <button
                      type='button'
                      className='staff-lms__ghost-btn staff-lms__danger'
                      onClick={() => handleDelete(setting.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const setting = await createStaffSetting(token, {
        key: `new_setting_${Date.now()}`,
        value: '',
      });
      navigate(EROUTES.STAFF_SETTING.replace(':id', String(setting.id)));
    } catch {
      setError('Не удалось создать настройку');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (settingId: number) => {
    if (!window.confirm('Удалить настройку?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      await deleteStaffSetting(token, settingId);
      setSettings((prev) => prev.filter((item) => item.id !== settingId));
    } catch {
      setError('Не удалось удалить настройку');
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
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.PERSON}>Главная</Link>
            {' / Settings'}
          </div>
          <div className='staff-lms__header'>
            <h1 className='staff-lms__title'>Settings</h1>
            <div className='staff-lms__actions'>
              <input
                className='staff-lms__search'
                type='search'
                placeholder='Поиск по ключу'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                text={isCreating ? 'Создание…' : 'Создать настройку'}
                type='button'
                color='primary'
                onClick={handleCreate}
                disabled={isCreating}
              />
            </div>
          </div>
          {content}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffSettings;
