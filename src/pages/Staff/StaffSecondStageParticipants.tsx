import { useEffect, useRef, useState } from 'react';
import type { ISecondStageFilters, ISecondStageReport, TSecondStageMissing, TSecondStageStatus } from '../../shared/utils/api';
import { exportSecondStageParticipants, getNominations, getSecondStageParticipants } from '../../shared/utils/api';
import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Button from '../../shared/components/Button/ui/Button';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import StaffBackButton from './components/StaffBackButton';
import { EROUTES } from '../../shared/utils/ERoutes';
import './staff-second-stage.css';

const STATUS_LABELS: Record<TSecondStageStatus, string> = {
  submitted: 'Всё загружено', in_progress: 'Загружено частично', not_started: 'Ничего не загружено'
};
const MISSING_LABELS: Record<TSecondStageMissing, string> = {
  video: 'Нет видео', presentation: 'Нет презентации', photo: 'Нет фото'
};
const initialFilters = (): ISecondStageFilters => ({ search: '', nomination: '', status: '', missing: [], page: 1 });

const MaterialLink = ({ url, text }: { url: string | null; text: string }) => (
  url && /^https?:\/\//.test(url)
    ? <a href={url} target='_blank' rel='noreferrer'>{text}</a> : null
);

const StaffSecondStageParticipants = () => {
  const [filters, setFilters] = useState<ISecondStageFilters>(initialFilters);
  const [result, setResult] = useState<{ filters: ISecondStageFilters; data: ISecondStageReport } | null>(null);
  const [failure, setFailure] = useState<ISecondStageFilters | null>(null);
  const [reload, setReload] = useState(0);
  const [nominations, setNominations] = useState<{ id: number; name: string }[]>([]);
  const [nominationError, setNominationError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const exportLock = useRef(false);
  const data = result?.filters === filters ? result.data : null;
  const hasError = failure === filters;

  useEffect(() => {
    let active = true;
    getNominations().then((items) => {
      if (active) { setNominations(items); setNominationError(false); }
    }).catch(() => { if (active) setNominationError(true); });
    return () => { active = false; };
  }, [reload]);

  useEffect(() => {
    const controller = new AbortController();
    setFailure(null);
    setExportError('');
    const token = localStorage.getItem('token');
    if (!token) { setFailure(filters); return () => controller.abort(); }
    getSecondStageParticipants(token, filters, controller.signal).then((response) => {
      if (!controller.signal.aborted) setResult({ filters, data: response });
    }).catch(() => {
      if (!controller.signal.aborted) setFailure(filters);
    });
    return () => controller.abort();
  }, [filters, reload]);

  const updateFilters = (patch: Partial<ISecondStageFilters>) => {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  };
  const retry = () => {
    setResult(null);
    setFailure(null);
    setReload((value) => value + 1);
  };
  const download = async () => {
    if (exportLock.current || !data) return;
    exportLock.current = true;
    setExporting(true);
    setExportError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Требуется авторизация');
      const blob = await exportSecondStageParticipants(token, filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'second_stage_participants.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError('Не удалось скачать Excel. Попробуйте ещё раз.');
    } finally {
      exportLock.current = false;
      setExporting(false);
    }
  };

  return (
    <MainLayout mainContainer={false} transparentMain>
      <div className='second-stage'>
        <section className='second-stage__panel'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='second-stage__header'>
            <div><h1>Второй этап</h1><p>Материалы и контакты участников, прошедших во второй этап</p></div>
            <Button text={exporting ? 'Подготовка Excel…' : 'Скачать Excel'} onClick={download} disabled={exporting || !data || hasError} />
          </div>
          {exportError && <p role='alert' className='second-stage__error'>{exportError}</p>}
          <div className='second-stage__cards' aria-label='Сводка по выбранным условиям'>
            {([
              ['total', 'Всего найдено'], ['submitted', 'Всё загружено'],
              ['inProgress', 'Загружено частично'], ['notStarted', 'Ничего не загружено']
            ] as const).map(([key, label]) => <div className={`second-stage__card second-stage__card_${key}`} key={key}>
              <strong>{data && !hasError ? data.cards[key] : '—'}</strong><span>{label}</span>
            </div>)}
          </div>
          <div className='second-stage__filters'>
            <label>Поиск
              <input type='search' value={filters.search} placeholder='ФИО, контакты или вуз'
                onChange={(event) => updateFilters({ search: event.target.value })} />
            </label>
            <label>Номинация
              <select value={filters.nomination} onChange={(event) => updateFilters({ nomination: event.target.value })}>
                <option value=''>Все номинации</option>
                {nominations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label>Комплект материалов
              <select value={filters.status} onChange={(event) => updateFilters({ status: event.target.value as TSecondStageStatus | '' })}>
                <option value=''>Все статусы</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <div className='second-stage__missing'>
            <fieldset><legend>Отсутствуют материалы</legend>
              {(Object.keys(MISSING_LABELS) as TSecondStageMissing[]).map((key) => <label key={key}>
                <input type='checkbox' checked={filters.missing.includes(key)} onChange={(event) => updateFilters({
                  missing: event.target.checked ? [...filters.missing, key] : filters.missing.filter((item) => item !== key)
                })} />{MISSING_LABELS[key]}
              </label>)}
            </fieldset>
            <Button text='Сбросить фильтры' color='inherit' onClick={() => setFilters(initialFilters())} />
          </div>
          {nominationError && <div role='alert' className='second-stage__error'>Не удалось загрузить номинации. <button type='button' onClick={retry}>Повторить</button></div>}
          <p className='second-stage__note'>Отметки показывают наличие материалов. Содержание и доступность ссылок нужно проверять отдельно. Excel содержит все результаты выбранных условий.</p>
          <div aria-busy={!data && !hasError} aria-live='polite'>
            {hasError ? <div role='alert' className='second-stage__error'>
              <p>Не удалось загрузить участников.</p><Button text='Повторить' onClick={retry} />
            </div> : !data ? <Preloader /> : <>
              {data.results.length === 0 ? <p className='second-stage__empty'>Участники не найдены. Попробуйте изменить условия поиска.</p> :
                <div className='second-stage__table-wrap' tabIndex={0} role='region' aria-label='Участники второго этапа'>
                  <table><thead><tr>
                    <th scope='col'>Участник</th><th scope='col'>Вуз и номинация</th><th scope='col'>Контакты</th>
                    <th scope='col'>Видео</th><th scope='col'>Презентация</th><th scope='col'>Фото</th><th scope='col'>Комплект</th>
                  </tr></thead><tbody>
                    {data.results.map((row) => <tr key={row.id}>
                      <td><strong>{row.fullname}</strong></td>
                      <td>{row.educational_organization || '—'}<span className='second-stage__secondary'>{row.nomination?.name || 'Номинация не указана'}</span></td>
                      <td className='second-stage__contacts'>
                        {row.email ? <a href={`mailto:${row.email}`}>{row.email}</a> : <span>Email не указан</span>}
                        {row.phone_number ? <a href={`tel:${row.phone_number}`}>{row.phone_number}</a> : <span>Телефон не указан</span>}
                        <span>Telegram: {row.telegram_username || '—'}</span>
                      </td>
                      <td><span className={row.hasVideo ? 'second-stage__yes' : 'second-stage__no'}>{row.hasVideo ? 'Есть' : 'Нет'}</span>
                        {row.hasVideo && <MaterialLink url={row.practice_video_url} text='Открыть видео' />}</td>
                      <td><span className={row.hasPresentation ? 'second-stage__yes' : 'second-stage__no'}>{row.hasPresentation ? 'Есть' : 'Нет'}</span>
                        <MaterialLink url={row.presentation_file_url} text='Открыть файл' /><MaterialLink url={row.presentation_url} text='Открыть ссылку' /></td>
                      <td><span className={row.hasPhoto ? 'second-stage__yes' : 'second-stage__no'}>{row.hasPhoto ? 'Есть' : 'Нет'}</span>
                        <MaterialLink url={row.photo_url} text='Открыть фото' /></td>
                      <td><span className={`second-stage__status second-stage__status_${row.secondStageStatus}`}>{STATUS_LABELS[row.secondStageStatus]}</span></td>
                    </tr>)}
                  </tbody></table>
                </div>}
              {data.count > 0 && <nav className='second-stage__pagination' aria-label='Страницы участников'>
                <Button text='Назад' disabled={!data.previous} onClick={() => setFilters((value) => ({ ...value, page: value.page - 1 }))} />
                <span>Страница {filters.page} из {Math.max(1, Math.ceil(data.count / 20))}</span>
                <Button text='Далее' disabled={!data.next} onClick={() => setFilters((value) => ({ ...value, page: value.page + 1 }))} />
              </nav>}
            </>}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default StaffSecondStageParticipants;
