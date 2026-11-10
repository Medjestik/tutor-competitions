import { useCallback, useEffect, useState } from 'react';
import Popup from '../../shared/components/Popup/ui/Popup';
import Button from '../../shared/components/Button/ui/Button';
import { createStaffLearningStream, updateStaffLearningStream, deleteStaffLearningStream, getStaffLearningStreams } from '../../shared/utils/api';
import type { IStaffLearningStream } from '../../shared/utils/api';
import './staff-course-progress.css';

type TProps = { isOpen: boolean; courseId: number | ''; onClose: () => void; onChanged: () => void };

export default function LearningStreamsModal({ isOpen, courseId, onClose, onChanged }: TProps) {
  const [streams, setStreams] = useState<IStaffLearningStream[]>([]);
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');
  const reset = () => { setName(''); setStart(''); setEnd(''); setEditing(null); setError(''); };
  const load = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || courseId === '') return;
    try { setStreams(await getStaffLearningStreams(token, courseId)); setError(''); }
    catch { setError('Не удалось загрузить потоки'); }
  }, [courseId]);
  useEffect(() => { if (isOpen) void load(); }, [isOpen, load]);
  const save = async () => {
    const token = localStorage.getItem('token');
    if (!token || courseId === '' || !name.trim() || !start || !end) { setError('Заполните название и даты потока'); return; }
    try {
      const data = { name: name.trim(), startDate: start, endDate: end };
      if (editing !== null) await updateStaffLearningStream(token, courseId, editing, data);
      else await createStaffLearningStream(token, courseId, data);
      reset(); await load(); onChanged();
    } catch { setError('Не удалось сохранить поток'); }
  };
  const remove = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token || courseId === '' || !window.confirm('Удалить поток? Назначения слушателей будут сняты.')) return;
    try { await deleteStaffLearningStream(token, courseId, id); reset(); await load(); onChanged(); }
    catch { setError('Не удалось удалить поток'); }
  };
  const close = () => { reset(); onClose(); };
  return <Popup isOpen={isOpen} onClose={close} popupWidth='full' closeOutside>
    <div className='staff-course-progress__modal'>
      <h2 className='staff-course-progress__modal-title'>Организационные потоки</h2>
      <Button text='Закрыть' onClick={close} />
      <div className='staff-course-progress__filters'>
        <label className='staff-course-progress__field'><span>Название</span><input value={name} onChange={e => setName(e.target.value)} /></label>
        <label className='staff-course-progress__field'><span>Начало</span><input type='date' value={start} onChange={e => setStart(e.target.value)} /></label>
        <label className='staff-course-progress__field'><span>Окончание</span><input type='date' value={end} onChange={e => setEnd(e.target.value)} /></label>
      </div>
      <div className='staff-course-progress__actions'><Button text={editing === null ? 'Создать поток' : 'Сохранить'} color='primary' onClick={save} />{editing !== null && <Button text='Отмена редактирования' onClick={reset} />}</div>
      {error && <p className='staff-course-progress__error'>{error}</p>}
      <table className='staff-course-progress__table'><thead><tr><th>Название</th><th>Начало</th><th>Окончание</th><th>Действия</th></tr></thead><tbody>
        {streams.length === 0 ? <tr><td colSpan={4}>Потоков пока нет</td></tr> : streams.map(stream => <tr key={stream.id}><td>{stream.name}</td><td>{stream.startDate}</td><td>{stream.endDate}</td><td>
          <Button text='Изменить' onClick={() => { setEditing(stream.id); setName(stream.name); setStart(stream.startDate); setEnd(stream.endDate); }} />
          <Button text='Удалить' onClick={() => void remove(stream.id)} />
        </td></tr>)}
      </tbody></table>
    </div>
  </Popup>;
}
